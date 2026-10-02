"""Exact-version website approvals -> existing native OpenClaw one-shot scheduler."""
import datetime,hashlib,hmac,json,os,re,sqlite3,subprocess
from pathlib import Path

def canonical(p):return json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
class WebsiteJobs:
 def __init__(self,root,state,runner=None):
  self.root=Path(root);self.state=Path(state);self.state.mkdir(parents=True,exist_ok=True)
  self.db=self.state/'website-jobs.sqlite';self.runner=runner or self.native
  with self.connect() as c:c.execute('CREATE TABLE IF NOT EXISTS jobs (week TEXT PRIMARY KEY, hash TEXT, proposal TEXT, state TEXT, job_id TEXT, receipt TEXT)')
  os.chmod(self.db,0o600)
 def connect(self):
  c=sqlite3.connect(self.db);c.row_factory=sqlite3.Row;return c
 def native(self,args):
  p=subprocess.run(['docker','exec','-u','node','openclaw','openclaw','cron',*args],capture_output=True,text=True,timeout=35)
  if p.returncode:raise ValueError('The native scheduler did not confirm the request. Reconnect and inspect the approval receipt before retrying.')
  try:return json.loads(p.stdout)
  except ValueError:raise ValueError('The native scheduler response could not be verified.') from None
 def proposal(self,identity,digest):
  register=json.loads((self.root/'website-proposals.json').read_text());a=next((a for a in register['proposals'] if a['id']==identity),None)
  if not a:raise ValueError('Unknown website proposal.')
  expected=a['sha256'];body={k:v for k,v in a.items() if k!='sha256'}
  if not hmac.compare_digest(expected,digest) or hashlib.sha256(canonical(body)).hexdigest()!=expected:raise ValueError('This website preview changed. Reload and review the current version.')
  component=(self.root/a['component']).resolve()
  if not component.is_relative_to(self.root.resolve()) or hashlib.sha256(component.read_bytes()).hexdigest()!=a['component_sha256']:raise ValueError('The implementation changed. Review the updated proposal before approving.')
  if a['props']['variant'] not in ['band','badge','slide'] or not re.fullmatch(r'2026-10-(07|14|21|28)',a['week']):raise ValueError('Proposal outside the approved October scope.')
  start=datetime.datetime.fromisoformat(a['props']['start']);end=datetime.datetime.fromisoformat(a['props']['end'])
  if start<=datetime.datetime.now(datetime.timezone.utc) or end-start!=datetime.timedelta(days=7):raise ValueError('This weekly window has already started or is invalid. Prepare a fresh approval before scheduling.')
  return a
 def ready(self):
  self.runner(['list','--all','--json']);return {'scheduler_ready':True,'owner':'remy','project':'peninsula-insider','schedule_only':True}
 def schedule(self,identity,digest,confirmed=False):
  if confirmed is not True:raise ValueError('Confirm this exact website treatment before scheduling.')
  a=self.proposal(identity,digest)
  with self.connect() as c:
   row=c.execute('SELECT * FROM jobs WHERE week=?',(a['week'],)).fetchone()
   if row:
    if row['hash']!=digest:raise ValueError('This week already has a selected treatment. Reconcile or cancel that job before approving another.')
    if row['state']=='scheduled':
     saved=next((x for x in self.runner(['list','--all','--json']).get('jobs',[]) if x.get('id')==row['job_id']),None)
     if not saved or saved.get('enabled') is not True or saved.get('agentId')!='main':raise ValueError('The saved job is missing or disabled. Reconcile its receipt in the native scheduler before replacing or retrying.')
     return {**json.loads(row['receipt']),'reused':True}
    raise ValueError('A previous request has an uncertain outcome. Inspect the native scheduler; no automatic duplicate will be created.')
   c.execute('INSERT INTO jobs VALUES(?,?,?,?,?,?)',(a['week'],digest,identity,'creating',None,None));c.commit()
   snapshot=self.state/(identity+'-'+digest[:12]+'.json');snapshot.write_text(json.dumps(a,ensure_ascii=False,indent=2));os.chmod(snapshot,0o600)
   # Approved immutable instruction only. Browser input cannot supply a command, path or destination.
   hostpath=str(snapshot);containerpath=hostpath.replace('/home/james/openclaw/workspace/','/home/node/.openclaw/workspace/')
   prompt=('James approved the exact Peninsula Insider October website treatment in the authenticated local preview. '+
   'Owner Remy (main), project peninsula-insider, current task pi-insider-note-october-2026. '+
   'Approval note and immutable brief: '+containerpath+'. SHA256 of the canonical proposal excluding sha256: '+digest+'. '+
   'Read that private receipt and the reviewed component in '+str(self.root).replace('/home/james/openclaw/workspace/','/home/node/.openclaw/workspace/')+'/'+a['component']+'. '+
   'Implement ONLY the approved treatment and its props. Use the current PI source repo and an isolated worktree, inspect existing source evidence and conflicts. '+
   'Insert after HomeCover for band, after HomeWeekend for badge, or after HomeDispatch for slide, on next/src/pages/index.astro only. '+
   'Preserve live hero video, all metadata, navigation, other modules and unrelated changes. Confirm the weekly active window remains current; stop if expired. '+
   'Recheck linked facts/access before release. Use mandatory Impeccable review, appropriate CI, deploy exact approved scope and verify live intended effect. '+
   'If component digest differs, source checks fail, or implementation is no longer compatible, stop and record the blocked reason; do not expand approval. '+
   'No social publishing, email sending/scheduling, spend or external messages are authorised. '+
   'Persist execution result in the existing PI deliverable and this approval receipt; update native task source if available. '+
   'User asked approval to reach Remy: this is the approval note. Keep private scope; do not send to an unrelated channel.')
   result=self.runner(['add','--name','PI October website '+identity,'--declaration-key','pi-october-website-'+a['week'],'--agent','main','--session','isolated','--at',a['props']['start'],'--message',prompt,'--no-deliver','--keep-after-run','--json'])
   job=result.get('job',result);jobid=job.get('id')
   if not isinstance(jobid,str) or not re.fullmatch(r'[A-Za-z0-9_-]{8,80}',jobid):raise ValueError('The scheduler did not return a usable job receipt. Inspect it before retrying.')
   # Save ID before readback, retaining an uncertain result for explicit reconciliation.
   c.execute('UPDATE jobs SET job_id=? WHERE week=?',(jobid,a['week']));c.commit()
   listed=self.runner(['list','--all','--json']);actual=next((x for x in listed.get('jobs',[]) if x.get('id')==jobid),None)
   if not actual or actual.get('agentId')!='main' or actual.get('enabled') is not True or actual.get('schedule',{}).get('kind')!='at' or actual.get('payload',{}).get('message')!=prompt:raise ValueError('The scheduler readback differs from the approved job. Inspect the saved job ID; no duplicate retry will run.')
   # Verify exact instant despite provider canonicalizing ISO to UTC.
   stamp=actual['schedule'].get('at') or actual['schedule'].get('atMs')
   observed=datetime.datetime.fromtimestamp(stamp/1000,datetime.timezone.utc) if isinstance(stamp,(float,int)) else datetime.datetime.fromisoformat(stamp.replace('Z','+00:00'))
   if observed!=datetime.datetime.fromisoformat(a['props']['start']):raise ValueError('Scheduled time differs from the approved window. Inspect the existing job.')
   receipt={'state':'scheduled','job_id':jobid,'proposal':identity,'sha256':digest,'scheduled_for':a['props']['start'],'expires_at':a['props']['end'],'approved_at':now(),'actor':__import__('getpass').getuser(),'owner':'remy','website_updated':False,'email_sent':False,'social_posted':False,'reused':False}
   c.execute('UPDATE jobs SET state=?,receipt=? WHERE week=?',('scheduled',json.dumps(receipt),a['week']))
   (self.state/(identity+'-receipt.json')).write_text(json.dumps(receipt,indent=2));os.chmod(self.state/(identity+'-receipt.json'),0o600)
   return receipt
