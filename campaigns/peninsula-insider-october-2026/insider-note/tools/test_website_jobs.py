import json,tempfile,unittest,shutil,datetime
from pathlib import Path
from website_jobs import WebsiteJobs
ROOT=Path(__file__).resolve().parents[1]
class Scheduler:
 def __init__(self):self.jobs=[];self.creates=0;self.fail=False;self.change=False
 def __call__(self,args):
  if args[0]=='add':
   self.creates+=1
   if self.fail:raise TimeoutError('uncertain result')
   get=lambda k:args[args.index(k)+1]
   job={'id':'test-job-0001','agentId':'main','enabled':True,'schedule':{'kind':'at','at':get('--at')},'payload':{'message':get('--message')}};self.jobs.append(job);return job
  if self.change and self.jobs:self.jobs[0]['agentId']='other'
  return {'jobs':self.jobs}
class WebsiteTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.scheduler=Scheduler();self.desk=WebsiteJobs(ROOT,Path(self.tmp.name)/'state',self.scheduler);self.p=json.loads((ROOT/'website-proposals.json').read_text())['proposals'][0]
 def tearDown(self):self.tmp.cleanup()
 def runjob(self,**kw):return self.desk.schedule(self.p['id'],self.p['sha256'],**kw)
 def test_requires_confirmation(self):
  with self.assertRaises(ValueError):self.runjob()
  self.assertEqual(self.scheduler.creates,0)
 def test_rejects_stale_hash(self):
  with self.assertRaises(ValueError):self.desk.schedule(self.p['id'],'bad',True)
 def test_duplicate_returns_same_job(self):
  a=self.runjob(confirmed=True);b=self.runjob(confirmed=True);self.assertEqual(a['job_id'],b['job_id']);self.assertTrue(b['reused']);self.assertEqual(self.scheduler.creates,1)
 def test_cancelled_job_not_claimed_scheduled(self):
  self.runjob(confirmed=True);self.scheduler.jobs=[]
  with self.assertRaises(ValueError):self.runjob(confirmed=True)
  self.assertEqual(self.scheduler.creates,1)
 def test_one_treatment_per_week(self):
  self.runjob(confirmed=True);p=json.loads((ROOT/'website-proposals.json').read_text())['proposals'][1]
  with self.assertRaises(ValueError):self.desk.schedule(p['id'],p['sha256'],True)
 def test_uncertain_no_retry(self):
  self.scheduler.fail=True
  with self.assertRaises(TimeoutError):self.runjob(confirmed=True)
  with self.assertRaises(ValueError):self.runjob(confirmed=True)
  self.assertEqual(self.scheduler.creates,1)
 def test_wrong_agent_not_success(self):
  self.scheduler.change=True
  with self.assertRaises(ValueError):self.runjob(confirmed=True)
 def test_component_change_invalidates_approval(self):
  root=Path(self.tmp.name)/'root';shutil.copytree(ROOT/'website',root/'website');shutil.copy(ROOT/'website-proposals.json',root/'website-proposals.json');(root/'website/OctoberCampaign.astro').write_text('changed')
  desk=WebsiteJobs(root,Path(self.tmp.name)/'state2',self.scheduler)
  with self.assertRaises(ValueError):desk.schedule(self.p['id'],self.p['sha256'],True)
 def test_unknown_id_no_schedule(self):
  with self.assertRaises(ValueError):self.desk.schedule('other',self.p['sha256'],True)
 def test_time_readback_and_no_publish_payload(self):
  result=self.runjob(confirmed=True);self.assertFalse(result['website_updated']);self.assertFalse(result['social_posted']);self.assertFalse(result['email_sent']);self.assertEqual(result['scheduled_for'],'2026-10-07T08:00:00+11:00')
if __name__=='__main__':unittest.main()
