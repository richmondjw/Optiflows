#!/usr/bin/env python3
"""Local, authenticated, approval-bound beehiiv draft desk. No send endpoint."""
import argparse, datetime, getpass, hashlib, hmac, json, os, re, secrets, sqlite3
import threading, urllib.error, urllib.parse, urllib.request
from html.parser import HTMLParser
from collections import Counter
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PUBLICATION='pub_91e9b723-53c4-456e-a857-9faa2d61864b'
ORIGINS={'https://www.optiflows.com.au','https://optiflows.com.au','http://127.0.0.1:8792','http://localhost:8792'}
TOKEN=secrets.token_urlsafe(32)
LOCK=threading.Lock()

def canonical(payload):return json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()

class EmailBody(HTMLParser):
 """Ignore harmless markup/whitespace; retain complete copy and destination URLs."""
 def __init__(self,markup):
  super().__init__(convert_charrefs=True);self.text=[];self.links=[];self.ignored=0;self.feed(markup)
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.ignored+=1
  if tag=='a':
   href=dict(attrs).get('href','')
   # The provider resolves its two built-in legal/web merge URLs.
   if href and '{{' not in href and not href.startswith('#'):self.links.append(href)
 def handle_endtag(self,tag):
  if tag in ('script','style') and self.ignored:self.ignored-=1
 def handle_data(self,data):
  if not self.ignored:self.text.append(data)
 def normalized(self):return re.sub(r'\s+',' ',' '.join(self.text)).strip()

def complete_body_matches(approved,actual):
 expected=EmailBody(approved);received=EmailBody(actual)
 # Provider wrappers may add text before/after the intact approved block.
 return expected.normalized() in received.normalized() and not (Counter(expected.links)-Counter(received.links))

class Desk:
 def __init__(self,root,state,credential_file=None,transport=None):
  self.root=Path(root).resolve();self.state=Path(state).resolve();self.state.mkdir(parents=True,exist_ok=True);os.chmod(self.state,0o700)
  self.db=self.state/'desk.sqlite';self.credentials=credential_file;self.transport=transport or self.provider
  with self.connect() as c:
   c.execute('CREATE TABLE IF NOT EXISTS approvals (hash TEXT PRIMARY KEY, issue TEXT, variant INTEGER, actor TEXT, created TEXT, revoked INTEGER DEFAULT 0)')
   c.execute('CREATE TABLE IF NOT EXISTS transfers (hash TEXT PRIMARY KEY, issue TEXT, state TEXT, post_id TEXT, preview_url TEXT, created TEXT, updated TEXT)')
  os.chmod(self.db,0o600)
 def connect(self):
  c=sqlite3.connect(self.db);c.row_factory=sqlite3.Row;return c
 def credentials_env(self):
  e=dict(os.environ)
  if self.credentials and Path(self.credentials).is_file():
   for line in Path(self.credentials).read_text().splitlines():
    line=line.strip().removeprefix('export ')
    if line and not line.startswith('#') and '=' in line:
     k,v=line.split('=',1);e[k]=v.strip().strip('\"\'')
  if e.get('BEEHIIV_PUBLICATION_ID',PUBLICATION)!=PUBLICATION:raise ValueError('The configured publication is not Peninsula Insider.')
  if not e.get('BEEHIIV_API_KEY'):raise ValueError('The local beehiiv credential is unavailable. Restore the existing credential file before connecting.')
  return e
 def provider(self,method,path,payload=None):
  env=self.credentials_env();data=canonical(payload) if payload is not None else None
  req=urllib.request.Request('https://api.beehiiv.com/v2/publications/'+PUBLICATION+path,data=data,method=method,headers={'Authorization':'Bearer '+env['BEEHIIV_API_KEY'],'Content-Type':'application/json'})
  try:
   with urllib.request.urlopen(req,timeout=25) as r:return r.status,json.load(r)
  except urllib.error.HTTPError as e:
   # Do not leak a provider response or credential-bearing request through a public browser.
   if e.code==202:return 202,{}
   raise ValueError('beehiiv returned HTTP '+str(e.code)+'. Check account access and reconcile the saved transfer before retrying.') from None
 def version(self,issue,variant=0,base_sha256=None):
  manifest=json.loads((self.root/'manifest.json').read_text());entry=next((x for x in manifest['issues'] if x['id']==issue),None)
  if entry is None or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',issue):raise ValueError('Unknown issue.')
  if type(variant) is not int or variant not in range(3):raise ValueError('Unknown subject option.')
  data=(self.root/entry['payload']).read_bytes()
  base=hashlib.sha256(data).hexdigest()
  if base!=entry['sha256'] or base_sha256 is not None and base_sha256!=base:raise ValueError('The preview changed. Reload it and approve the current version.')
  p=json.loads(data);source=next(x for x in json.loads((self.root/'sources/issues.json').read_text()) if x['id']==issue)
  p['email_settings']['email_subject_line'],p['email_settings']['email_preview_text']=source['variants'][variant]
  if p.get('status')!='draft' or any(k in p for k in ['scheduled_at','override_scheduled_at']):raise ValueError('Only unscheduled draft payloads are allowed.')
  if 'body_content' not in p or '—' in p['body_content'] or '$' in p['body_content']:raise ValueError('The email failed house-style checks.')
  return p,hashlib.sha256(canonical(p)).hexdigest()
 def approve(self,issue,variant,digest):
  _,current=self.version(issue,variant)
  if not hmac.compare_digest(current,digest):raise ValueError('Approval does not match the current email.')
  with self.connect() as c:c.execute('INSERT OR REPLACE INTO approvals VALUES(?,?,?,?,?,0)',(current,issue,variant,getpass.getuser(),now()))
  return {'sha256':current,'state':'approved_for_draft','actor':getpass.getuser()}
 def revoke(self,digest):
  with self.connect() as c:c.execute('UPDATE approvals SET revoked=1 WHERE hash=?',(digest,))
  return {'state':'revoked'}
 def push(self,issue,variant,digest):
  payload,current=self.version(issue,variant)
  if not hmac.compare_digest(current,digest):raise ValueError('This approval is stale. Review and approve the changed email.')
  with LOCK:
   with self.connect() as c:
    a=c.execute('SELECT * FROM approvals WHERE hash=? AND revoked=0',(current,)).fetchone()
    if a is None:raise ValueError('Approve this exact version before pushing it to beehiiv.')
    row=c.execute('SELECT * FROM transfers WHERE hash=?',(current,)).fetchone()
    if row and not row['post_id']:raise ValueError('A prior creation attempt has an uncertain outcome. Reconcile it in beehiiv; the desk will not create a possible duplicate.')
    reused=row is not None
    if row:
     post_id=row['post_id'];preview=row['preview_url']
    else:
     # Intent before any POST: network timeouts or crashes cannot trigger an automatic second creation.
     c.execute('INSERT INTO transfers VALUES(?,?,?,?,?,?,?)',(current,issue,'creating',None,None,now(),now()));c.commit()
     code,result=self.transport('POST','/posts',payload)
     if code!=201:raise ValueError('beehiiv did not acknowledge draft creation. Reconcile the saved attempt before retrying.')
     d=result.get('data',{});post_id=d.get('id')
     if not post_id or not re.fullmatch(r'post_[0-9a-f-]+',post_id):raise ValueError('beehiiv did not return a usable post ID. Reconcile the attempt.')
     preview=d.get('preview_url') or 'https://app.beehiiv.com/posts/'+post_id+'/preview'
     c.execute('UPDATE transfers SET state=?,post_id=?,preview_url=?,updated=? WHERE hash=?',('processing',post_id,preview,now(),current));c.commit()
    code,result=self.transport('GET','/posts/'+post_id+'?expand[]=free_email_content')
    if code==202:return {'state':'processing','post_id':post_id,'preview_url':preview,'reused':reused}
    d=result.get('data',{})
    if code!=200 or d.get('status')!='draft' or d.get('publish_date') or d.get('scheduled_at'):raise ValueError('Read-back did not confirm an unscheduled draft. Open beehiiv and inspect the saved post.')
    if d.get('subject_line')!=payload['email_settings']['email_subject_line'] or d.get('preview_text')!=payload['email_settings']['email_preview_text']:raise ValueError('beehiiv read-back differs from the approved subject or preheader. Inspect the saved draft.')
    content=d.get('content',{}).get('free',{}).get('email','')
    if not content or 'Been somewhere brilliant this week' not in content:raise ValueError('Draft body is not ready or differs from the approved email. Inspect the existing post before any retry.')
    verified=complete_body_matches(payload['body_content'],content)
    state='draft' if verified else 'body_verification_pending'
    c.execute('UPDATE transfers SET state=?,updated=? WHERE hash=?',(state,now(),current))
    receipt={'state':state,'body_verified':verified,'post_id':post_id,'preview_url':preview,'sha256':current,'actor':a['actor'],'approved_at':a['created'],'verified_at':now(),'send_authorised':False,'scheduled':False,'reused':reused}
    path=self.state/(issue+'-'+current[:12]+'.json');path.write_text(json.dumps(receipt,indent=2));os.chmod(path,0o600)
    return receipt

class Handler(SimpleHTTPRequestHandler):
 desk=None
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(self.desk.root),**kwargs)
 def log_message(self,*args):pass
 def host_ok(self):return self.headers.get('Host') in ['127.0.0.1:8792','localhost:8792']
 def origin_ok(self):return self.headers.get('Origin') in ORIGINS
 def authorised(self):return hmac.compare_digest(self.headers.get('Authorization',''),'Bearer '+TOKEN)
 def json_response(self,code,data):
  self.send_response(code);self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
  origin=self.headers.get('Origin')
  if origin in ORIGINS:self.send_header('Access-Control-Allow-Origin',origin);self.send_header('Vary','Origin')
  self.end_headers();self.wfile.write(json.dumps(data).encode())
 def do_OPTIONS(self):
  if not self.host_ok() or not self.origin_ok():return self.json_response(403,{'error':'Untrusted browser origin.'})
  self.send_response(204);self.send_header('Access-Control-Allow-Origin',self.headers['Origin']);self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS');self.send_header('Access-Control-Allow-Headers','Authorization,Content-Type');self.send_header('Access-Control-Allow-Private-Network','true');self.send_header('Vary','Origin');self.end_headers()
 def do_GET(self):
  if not self.host_ok():return self.json_response(403,{'error':'Untrusted host.'})
  path=urllib.parse.urlsplit(self.path)
  if path.path=='/api/session':
   if self.headers.get('Origin') not in [None,'http://127.0.0.1:8792','http://localhost:8792']:return self.json_response(403,{'error':'Connect through the local approval window.'})
   return self.json_response(200,{'token':TOKEN})
  if path.path=='/api/status':
   if not self.authorised():return self.json_response(401,{'error':'Connect the local email desk first.'})
   try:
    code,j=self.desk.transport('GET','');name=j.get('data',{}).get('name')
    if code!=200 or j.get('data',{}).get('id')!=PUBLICATION:raise ValueError('The connected account is not the expected Peninsula Insider publication.')
    return self.json_response(200,{'publication':name,'draft_only':True})
   except ValueError as e:return self.json_response(409,{'error':str(e)})
  if path.path=='/connect':
   origin=urllib.parse.parse_qs(path.query).get('origin',[''])[0]
   if origin not in ORIGINS:return self.json_response(403,{'error':'Connect from the Peninsula Insider preview.'})
   # Human action required on this local page; token is only sent to the allowlisted opener.
   text='''<!doctype html><html lang="en-AU"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect the PI email desk</title><body style="margin:0;padding:36px;background:#F2EFEA;color:#0B2E4A;font-family:Arial,sans-serif;line-height:1.6"><h1 style="font-size:28px;line-height:1.2">Connect Peninsula Insider</h1><p>Allow the review page to create approved, unscheduled drafts using this computer’s existing beehiiv account.</p><p>No email will be scheduled or sent. The account key stays on this computer.</p><button id="connect" style="padding:14px 20px;background:#0B2E4A;color:white;border:0;font-size:16px;cursor:pointer">Connect this preview</button><p id="status" role="status"></p><script>document.getElementById('connect').onclick=()=>{if(!window.opener){document.getElementById('status').textContent='Open Connect beehiiv from the preview page.';return;}window.opener.postMessage({type:'pi-beehiiv-connected',token:__TOKEN__},__ORIGIN__);document.getElementById('status').textContent='Connected. Return to the preview to approve an email.';document.getElementById('connect').disabled=true;};</script></body></html>'''.replace('__TOKEN__',json.dumps(TOKEN)).replace('__ORIGIN__',json.dumps(origin))
   self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('X-Frame-Options','DENY');self.send_header('Referrer-Policy','no-referrer');self.end_headers();self.wfile.write(text.encode());return
  if path.path.startswith('/api/'):return self.json_response(404,{'error':'Unknown action.'})
  if path.path=='/gate.js':
   self.send_response(200);self.send_header('Content-Type','application/javascript');self.end_headers();self.wfile.write(b'/* Local desk uses the OS boundary and ephemeral approval token. */');return
  return super().do_GET()
 def do_POST(self):
  if not self.host_ok() or not self.origin_ok() or not self.authorised():return self.json_response(403,{'error':'Connect from the trusted preview before making changes.'})
  try:
   size=int(self.headers.get('Content-Length','0'))
   if not 0<size<2048:raise ValueError('Invalid request size.')
   d=json.loads(self.rfile.read(size));path=urllib.parse.urlsplit(self.path).path
   if path=='/api/version':_,digest=self.desk.version(d['id'],d.get('variant',0),d.get('base_sha256'));result={'sha256':digest}
   elif path=='/api/approve':result=self.desk.approve(d['id'],d['variant'],d['sha256'])
   elif path=='/api/revoke':result=self.desk.revoke(d['sha256'])
   elif path=='/api/push':result=self.desk.push(d['id'],d['variant'],d['sha256'])
   else:return self.json_response(404,{'error':'Unknown action. Only draft transfer is supported.'})
   self.json_response(200,result)
  except (ValueError,KeyError,json.JSONDecodeError) as e:self.json_response(409,{'error':str(e)})
  except Exception:self.json_response(503,{'error':'The local desk could not confirm the result. Inspect its saved transfer and beehiiv before retrying.'})

def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--state',type=Path,required=True);p.add_argument('--credentials',type=Path,required=True);args=p.parse_args()
 Handler.desk=Desk(args.root,args.state,args.credentials)
 server=ThreadingHTTPServer(('127.0.0.1',8792),Handler)
 print('PI email desk ready at http://127.0.0.1:8792. Draft transfer only.',flush=True)
 server.serve_forever()
if __name__=='__main__':main()
