import importlib.util, json, tempfile, unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('desk',Path(__file__).with_name('beehiiv_desk.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
ROOT=Path(__file__).resolve().parents[1]
POST='post_00000000-0000-0000-0000-000000000001'

class Provider:
 def __init__(self):self.posts=0;self.async_once=False;self.payload=None;self.fail=False;self.invalid_status=False;self.changed_body=False
 def __call__(self,method,path,payload=None):
  if method=='POST':
   self.posts+=1;self.payload=payload
   if self.fail:raise TimeoutError('simulated uncertain creation')
   return 201,{'data':{'id':POST}}
  if self.async_once:self.async_once=False;return 202,{}
  return 200,{'data':{'id':POST,'status':'confirmed' if self.invalid_status else 'draft','publish_date':None,'subject_line':self.payload['email_settings']['email_subject_line'],'preview_text':self.payload['email_settings']['email_preview_text'],'content':{'free':{'email':self.payload['body_content'].replace('Leave room for the evening','Changed approved headline') if self.changed_body else self.payload['body_content']}}}}

class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.provider=Provider();self.desk=module.Desk(ROOT,self.tmp.name,transport=self.provider);self.issue='2026-10-07'
  self.payload,self.digest=self.desk.version(self.issue,0)
 def tearDown(self):self.tmp.cleanup()
 def approve(self):self.desk.approve(self.issue,0,self.digest)
 def test_no_approval_no_post(self):
  with self.assertRaises(ValueError):self.desk.push(self.issue,0,self.digest)
  self.assertEqual(self.provider.posts,0)
 def test_draft_only_and_idempotent(self):
  self.approve();first=self.desk.push(self.issue,0,self.digest);second=self.desk.push(self.issue,0,self.digest)
  self.assertEqual(first['state'],'draft');self.assertTrue(second['reused']);self.assertEqual(self.provider.posts,1)
  self.assertEqual(self.provider.payload['status'],'draft');self.assertNotIn('scheduled_at',self.provider.payload)
 def test_async_reads_same_id(self):
  self.approve();self.provider.async_once=True
  self.assertEqual(self.desk.push(self.issue,0,self.digest)['state'],'processing')
  self.assertEqual(self.desk.push(self.issue,0,self.digest)['state'],'draft');self.assertEqual(self.provider.posts,1)
 def test_uncertain_outcome_no_retry(self):
  self.approve();self.provider.fail=True
  with self.assertRaises(TimeoutError):self.desk.push(self.issue,0,self.digest)
  with self.assertRaisesRegex(ValueError,'uncertain'):self.desk.push(self.issue,0,self.digest)
  self.assertEqual(self.provider.posts,1)
 def test_changed_subject_requires_approval(self):
  self.approve();_,different=self.desk.version(self.issue,1)
  self.assertNotEqual(different,self.digest)
  with self.assertRaises(ValueError):self.desk.push(self.issue,1,different)
  self.assertEqual(self.provider.posts,0)
 def test_revoked_approval_blocks_push(self):
  self.approve();self.desk.revoke(self.digest)
  with self.assertRaises(ValueError):self.desk.push(self.issue,0,self.digest)
 def test_version_mismatch(self):
  with self.assertRaises(ValueError):self.desk.version(self.issue,0,'wrong')
  with self.assertRaises(ValueError):self.desk.approve(self.issue,0,'wrong')
 def test_bad_readback_not_success(self):
  self.approve();self.provider.invalid_status=True
  with self.assertRaisesRegex(ValueError,'unscheduled draft'):self.desk.push(self.issue,0,self.digest)
 def test_changed_body_with_reply_does_not_confirm(self):
  self.approve();self.provider.changed_body=True
  result=self.desk.push(self.issue,0,self.digest)
  self.assertEqual(result['state'],'body_verification_pending');self.assertFalse(result['body_verified'])
  self.desk.push(self.issue,0,self.digest);self.assertEqual(self.provider.posts,1)
 def test_body_normalization_preserves_links_and_all_copy(self):
  self.assertTrue(module.complete_body_matches('<p>A &amp; B</p><a href="https://example.org/a">Read</a>','<div>Provider header</div><p>A &amp; B</p> <a href="https://example.org/a">Read</a><footer>Legal footer</footer>'))
  self.assertFalse(module.complete_body_matches('<p>A B</p><a href="https://example.org/a">Read</a>','<p>A B</p><a href="https://example.org/wrong">Read</a>'))
 def test_wrong_issue_or_variant(self):
  for issue,variant in [('unknown',0),(self.issue,4),(self.issue,'1')]:
   with self.assertRaises(ValueError):self.desk.version(issue,variant)
 def test_all_four_exports(self):
  for item in json.loads((ROOT/'manifest.json').read_text())['issues']:
   p,digest=self.desk.version(item['id'],0);self.assertEqual(p['status'],'draft');self.assertTrue(p['body_content'])
   self.assertNotIn('<script',p['body_content']);self.assertNotIn('<style',p['body_content']);self.assertEqual(len(digest),64)
if __name__=='__main__':unittest.main()
