#!/usr/bin/env python3
"""Rebuild review-only publishing downloads. Requires Node, Pillow, reportlab, pypdf.
No network, source edits, publishing or email actions. ZIP timestamps and PDFs are deterministic.
"""
import csv, hashlib, io, json, shutil, subprocess, zipfile
from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / 'downloads'
KIT = OUT / 'publishing-kit'
KIT.mkdir(parents=True, exist_ok=True)
js = "const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],'utf8')+';globalThis.result=CAMPAIGN',c);process.stdout.write(JSON.stringify(c.result));"
DATA = json.loads(subprocess.check_output(['node','-e',js,str(BASE/'campaign-data.js')], encoding='utf-8'))
assert len(DATA['weeks']) == 12 and len(DATA['emails']) == 8 and len(DATA['carousels']) == 5
# A stale generated alternative must never re-enter a ZIP through recursive bundling.
legacy_paths=[BASE/'assets/carousels/co-branded', *OUT.glob('*co-branded*'), *(KIT/'carousels'/c['id']/'co-branded' for c in DATA['carousels'])]
legacy_paths=[str(p.relative_to(BASE)) for p in legacy_paths if p.exists()]
if legacy_paths:
    raise SystemExit('Remove these superseded generated outputs before rebuilding: '+', '.join(legacy_paths))
HOLD = 'REVIEW ONLY — NOT ACTIVATED. Technical claims, destination/form/tracking, audience, owner and human release approval remain required. Source URLs are unverified; no publishing or send authority.'
rows=[]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def rel(p): return p.relative_to(BASE).as_posix()
def record(p, aid, channel, source='', copy='', holds=HOLD):
    inside=p.is_relative_to(KIT) and p.suffix.lower() != '.mp4'
    r=dict(asset_id=aid, channel=channel, file=rel(p), archive_path=p.relative_to(KIT).as_posix() if inside else '', external_only=not inside, bytes=p.stat().st_size, sha256=digest(p), source_file=source, source_copy=copy, readiness='file_exported; activation_held', readiness_holds=holds, destination_status='source_provided_unverified')
    if source and (BASE/source).is_file(): r['source_sha256']=digest(BASE/source)
    if p.suffix.lower()=='.png':
        with Image.open(p) as im:r.update(width=im.width,height=im.height)
    if p.suffix.lower()=='.pdf':r['pages']=len(PdfReader(p).pages)
    rows.append(r)
    return p
def text(p,s,aid,channel='instructions',copy=''):
    p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8',newline='\n')
    return record(p,aid,channel,'campaign-data.js',copy)
def native(p,target,aid,channel):
    target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
    return record(target,aid,channel,rel(p))
def png(p,target,aid,channel,copy=''):
    target.parent.mkdir(parents=True,exist_ok=True)
    with Image.open(p) as im:
        im.load();im.save(target,format='PNG',optimize=True)
        with Image.open(target) as result:
            assert result.size==im.size and result.convert('RGBA').tobytes()==im.convert('RGBA').tobytes()
    return record(target,aid,channel,rel(p),copy)
def bundle(path,files,root):
    with zipfile.ZipFile(path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p in sorted(p for p in files if p.is_file()):
            info=zipfile.ZipInfo(p.relative_to(root).as_posix(),date_time=(2026,9,10,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644 << 16
            z.writestr(info,p.read_bytes())
    with zipfile.ZipFile(path) as z: assert z.testzip() is None
    return path

text(KIT/'README.txt',HOLD+'\n\nPublishing files, not approval. Weekly captions are exact source strings. PNGs preserve the decoded WebP pixels and dimensions without crop or redesign. Format export cannot improve existing source resolution.\n\nLinkedIn: upload a weekly feed/square PNG and paste its caption, OR upload the applicable five-page document PDF with its matching caption. Wide/story files are format alternatives, not four additional scheduled posts. Confirm current channel requirements before publishing.\n\nEmail designs are screenshots, not HTML or an ESP-ready send template. Import exact copy into an approved ESP template and integrate sender, consent/suppression, unsubscribe/preference links, accessibility and tested destination links before release. No recipient lists included.\n\nWebsite and motion files remain design/motion STUDIES. The two video studies are separate downloads, linked in motion-studies/README.txt, and excluded from the all-in-one ZIP; all finished publishing PNGs and PDFs are included. The guide is the existing source PDF, copied unchanged. Corporate/product claims and application-dependent limitations remain in source evidence and weekly notes.\n\nThe proposed campaign destination is '+DATA['meta']['primaryUrl']+' (unverified; root observed HTTP403 during fetch).\n\nOfficial format references:\nhttps://www.linkedin.com/help/linkedin/answer/a564109/media-file-types-supported-on-linkedin?lang=en\nhttps://www.linkedin.com/help/linkedin/answer/a518909\n\nRebuild: python tools/build-publishing-kit.py (Node, Pillow, reportlab, pypdf). Deterministic PDFs and ZIP member timestamps; no network calls.\n','campaign-readme')
text(KIT/'source-campaign.json',json.dumps(DATA,ensure_ascii=False,indent=2)+'\n','campaign-source','source data','CAMPAIGN')
text(KIT/'release-gates.json',json.dumps(DATA.get('gates',[]),ensure_ascii=False,indent=2)+'\n','release-gates','evidence','CAMPAIGN.gates')
old_manifest=KIT/'evidence/asset-manifest.json'
if old_manifest.is_file():old_manifest.unlink()  # Former generator output only; source manifest is never touched.
for name in ['creative-provenance.json']:
    native(BASE/name,KIT/'evidence'/name,name,'source evidence')
weeks={w['week']:w for w in DATA['weeks']}
for w in DATA['weeks']:
    wid=w['id'];folder=KIT/'weeks'/wid;pointer=f"CAMPAIGN.weeks[id={wid}]"
    text(folder/'caption.txt',w['caption'],wid,'LinkedIn caption',pointer+'.caption')
    text(folder/'source-copy.json',json.dumps(w,ensure_ascii=False,indent=2)+'\n',wid,'complete source copy',pointer)
    destination_note='Source URL field is relative; caption separately contains an absolute review-guide URL. Resolve and approve the intended public destination before publishing.\n' if not w['url'].startswith('https://') else ''
    text(folder/'README.txt',f"{wid} — {w['label']}\nProposed date: {w['date']}\nSource channels: {', '.join(w['channels'])}\nDestination (unverified): {w['url']}\n{destination_note}CTA: {w['cta']}\nEvidence / claim limit: {w['evidence']}\n\n{HOLD}\n\nUse feed or square as the still-post alternative; story/wide are additional format exports, not additional scheduled posts. Caption.txt is exact source copy and includes its source URL.\n",wid)
    for fmt in ['feed','square','story','wide']:
        png(BASE/f'assets/exports/{wid}-{fmt}.webp',folder/f'{wid}-{fmt}.png',wid+'-'+fmt,'social format export',pointer)

for c in DATA['carousels']:
    cid=c['id'];folder=KIT/'carousels'/cid;w=weeks[c['week']]
    assert len(c['slides'])==5
    for variant, label in [('', 'M2M Connectivity'), ('m2m-one', 'M2M One')]:
        variant_folder=folder/variant if variant else folder
        source_folder=BASE/'assets/carousels'/variant if variant else BASE/'assets/carousels'
        suffix='-m2m-one' if variant else ''
        slidepaths=[]
        for n in range(1,6):
            slidepaths.append(png(source_folder/f'{cid}-{n:02}.webp',variant_folder/f'{cid}-{n:02}.png',f'{cid}{suffix}-{n:02}','LinkedIn document slide — '+label,f'CAMPAIGN.carousels[id={cid}].slides[{n-1}]'))
        pdf=OUT/f'{cid}{suffix}-linkedin-document.pdf'
        doc=canvas.Canvas(str(pdf),invariant=1,pageCompression=1)
        doc.setTitle(c['title']+' — '+label);doc.setAuthor(label);doc.setSubject('Review-only ordered five-slide document; '+label+'; activation held')
        for slide in slidepaths:
            with Image.open(slide) as im:
                # Full-resolution JPEG embedding keeps document downloads practical.
                # Lossless decoded-source PNG slides remain alongside each PDF.
                encoded=io.BytesIO();im.convert('RGB').save(encoded,format='JPEG',quality=95,subsampling=0,optimize=True);encoded.seek(0)
                doc.setPageSize((im.width,im.height));doc.drawImage(ImageReader(encoded),0,0,width=im.width,height=im.height);doc.showPage()
        doc.save();assert len(PdfReader(pdf).pages)==5
        record(pdf,cid+suffix,'LinkedIn document PDF — '+label,copy=f'CAMPAIGN.carousels[id={cid}]')
        native(pdf,variant_folder/pdf.name,cid+suffix,'LinkedIn document PDF — '+label)
        text(variant_folder/'BRAND-VERSION.txt',f"{label} version. Use all five slides from this folder together. Do not mix logo versions within one document. Official logo artwork is positioned at the top left.\n{HOLD}\n",cid+suffix)
        text(variant_folder/'caption.txt',w['caption'],cid+suffix,'LinkedIn document caption',f"CAMPAIGN.weeks[id={w['id']}].caption")
        text(variant_folder/'source-copy.json',json.dumps(c,ensure_ascii=False,indent=2)+'\n',cid+suffix,'complete source copy',f'CAMPAIGN.carousels[id={cid}]')
        text(variant_folder/'README.txt',f"{c['title']}\n{label} independent version\nWeek {c['week']} — source caption from {w['id']}.\nThis folder contains five {label} PNG slides, one ordered five-page PDF, caption.txt and source-copy.json. Each slide carries exactly one official {label} logo at the top left. Upload the PDF as one document, or use slides 01–05 in order. Keep this brand version together.\nDestination (unverified): {w['url']}\nClaim limit: {w['evidence']}\n{HOLD}\nFull-resolution image-based PDFs use high-quality JPEG compression; PNG slides retain decoded-source pixels. No selectable text/accessibility tagging; source slide text is in source-copy.json.\n",cid+suffix)

for e in DATA['emails']:
    eid=e['id'];folder=KIT/'emails'/eid;pointer=f'CAMPAIGN.emails[id={eid}]'
    body='\n\n'.join([e['headline']]+e.get('paragraphs',[])+(['\n'.join('• '+b for b in e['bullets'])] if e.get('bullets') else [])+[e['cta']])
    text(folder/'email.txt','SUBJECT: '+e['subject']+'\nPREHEADER: '+e['preheader']+'\n\n'+body+'\n',eid,'email copy',pointer)
    text(folder/'subject.txt',e['subject'],eid,'email subject',pointer+'.subject')
    text(folder/'preheader.txt',e['preheader'],eid,'email preheader',pointer+'.preheader')
    text(folder/'source-copy.json',json.dumps(e,ensure_ascii=False,indent=2)+'\n',eid,'complete source copy',pointer)
    png(BASE/f'assets/email/{eid}-email.webp',folder/f'{eid}-email-design.png',eid,'email design screenshot',pointer)
    text(folder/'README.txt',f"{eid} — week {e['week']}\nSegment: {e['segment']}\nDesign screenshot only — not HTML and not send-ready.\nNo individual email URL is present in the source record. Campaign-level proposed destination: {DATA['meta']['primaryUrl']} (unverified; resolve the correct CTA destination in the ESP).\nImport subject/preheader/body into the approved ESP template. Complete sender identity, footer, consent/suppression, preference/unsubscribe links, accessible image text and test-send checks before release. No sender/footer content has been fabricated.\n{HOLD}\n",eid)

for group in ['website','motion']:
    for p in sorted((BASE/'assets'/group).glob('*')):
        if p.is_file():
            if p.suffix=='.webp':png(p,KIT/(group+'-studies')/(p.stem+'.png'),p.stem,group+' study')
            else:native(p,KIT/(group+'-studies')/p.name,p.stem,group+' study')
    study_links=''.join('https://optiflows.com.au/campaigns/9604-hybrid-connectivity/assets/motion/'+p.name+'\n' for p in sorted((BASE/'assets/motion').glob('*.mp4'))) if group=='motion' else ''
    text(KIT/(group+'-studies')/'README.txt',study_links+f'{group.upper()} STUDIES — review only. Existing source assets; no production activation.\n{HOLD}\n',group)
native(OUT/'hybrid-iot-readiness-guide.pdf',KIT/'guide/hybrid-iot-readiness-guide.pdf','readiness-guide','existing guide PDF')
native(OUT/'campaign-calendar.csv',KIT/'evidence/campaign-calendar.csv','calendar','proposed calendar')
def plain_fields(obj):
    if isinstance(obj,dict):return '\n\n'.join(k+':\n'+plain_fields(v) for k,v in obj.items())
    if isinstance(obj,list):return '\n\n'.join(plain_fields(v) for v in obj)
    return str(obj)
for key,folder in [('paidSearch','paid-search'),('retargeting','retargeting'),('talkTracks','sales-talk-tracks'),('website','website-copy')]:
    text(KIT/f'{folder}/copy.txt',plain_fields(DATA[key])+'\n',key,'exact source copy',f'CAMPAIGN.{key}')
    text(KIT/f'{folder}/README.txt','Exact source fields exported as labelled plain text; no new copy or activation approval.\n'+HOLD+'\n',key)
text(KIT/'START-HERE.md','# Hybrid IoT publishing kit\n\nOnce release approval is recorded:\n1. Choose the matching weekly post or carousel folder.\n2. Upload one PNG, or the five-page LinkedIn document PDF.\n3. Paste caption.txt and confirm the intended destination.\n\n'+HOLD+'\n\n- Weekly still posts: weeks/w01 through w12. Choose one appropriate image format and use the matching caption.txt.\n- LinkedIn documents: five stories, each supplied in two brand versions: 10 five-page PDFs and 50 PNG slides. The main carousel folder is M2M Connectivity; m2m-one/ is M2M One. Each version is independent and carries only its own official logo at the top left. Each brand folder includes its matching caption.txt, source-copy.json and instructions. Ten brand-specific carousel ZIPs are ready to use independently; five additional story ZIPs contain both alternatives in separate folders. Captions reuse unchanged source weekly copy.\n- Emails: exact subject/preheader/body plus screenshots. ESP template, footer and send checks remain required.\n- Website/motion folders are studies only. The two videos remain separate downloads, linked in motion-studies/README.txt; video binaries are not in this ZIP.\n- Week 10 has a relative URL field and a separate absolute review-guide URL in its caption. Resolve the intended approved public destination before publishing; both source values are preserved.\n- Email e08 clinic date, speaker and capacity remain unconfirmed.\n- Read README.txt, each asset README, source-copy.json and release-gates.json before release.\n\nThe manifest inside the ZIP lists payload files and standalone ZIPs; the external manifest additionally records the full ZIP checksum to avoid a self-referential hash.\n','start-here')

def manifests():
    payload=dict(campaign_id=DATA['meta']['id'],source_copy_sha256=digest(BASE/'campaign-data.js'),status='exported_for_review_activation_held',source_urls='unverified',files=rows,exclusions=['No send-ready HTML email','No publication approval','No accessibility-tagged document PDFs','No live destination verification','Manifest files omit their own hashes'])
    j=OUT/'publishing-manifest.json';j.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    cols=list(dict.fromkeys(k for r in rows for k in r));p=OUT/'publishing-manifest.csv'
    with p.open('w',encoding='utf-8-sig',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=cols,lineterminator='\n');writer.writeheader();writer.writerows(rows)
    return j,p
for w in DATA['weeks']:
    folder=KIT/'weeks'/w['id'];record(bundle(OUT/f"{w['id']}-publishing-kit.zip",folder.rglob('*'),folder),w['id'],'weekly ZIP')
for c in DATA['carousels']:
    folder=KIT/'carousels'/c['id']
    for variant, label in [('', 'M2M Connectivity'), ('m2m-one', 'M2M One')]:
        variant_folder=folder/variant if variant else folder
        slug=variant or 'm2m-connectivity'
        # Each standalone ZIP uses only immediate files from its own brand folder.
        record(bundle(OUT/f"{c['id']}-{slug}-carousel-kit.zip",variant_folder.glob('*'),variant_folder),c['id']+'-'+slug,'carousel ZIP — '+label)
    record(bundle(OUT/f"{c['id']}-carousel-kit.zip",folder.rglob('*'),folder),c['id'],'carousel ZIP — two independent brand versions')
for e in DATA['emails']:
    folder=KIT/'emails'/e['id'];record(bundle(OUT/f"{e['id']}-email-kit.zip",folder.rglob('*'),folder),e['id'],'email ZIP')
for p in manifests():shutil.copyfile(p,KIT/p.name)
full=bundle(OUT/'hybrid-iot-publishing-kit.zip',(p for p in KIT.rglob('*') if p.is_file() and p.suffix.lower() != '.mp4'),KIT)
record(full,DATA['meta']['id'],'full publishing ZIP')
manifests()
assert all((BASE/r['file']).is_file() and digest(BASE/r['file'])==r['sha256'] for r in rows)
print(json.dumps(dict(full_zip=rel(full),bytes=full.stat().st_size,manifest_rows=len(rows),weeks=12,carousel_pdfs=10,carousel_pngs=50,carousel_kits=15,independent_brand_kits=10,email_kits=8,source_edits=False)))
