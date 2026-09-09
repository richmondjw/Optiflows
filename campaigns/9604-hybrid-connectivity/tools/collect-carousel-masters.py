import json, hashlib, urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
folder=root/'assets/higgsfield-masters'
raw=root/'tmp/carousel-provider-receipts'
raw.mkdir(parents=True,exist_ok=True)
receipts=[]
jobs=sorted(folder.glob('carousel-*-job.json'))
if not jobs: raise SystemExit('No new provider jobs to collect; existing receipts left unchanged.')
for jobfile in jobs:
    data=json.loads(jobfile.read_text(encoding='utf-8-sig'))
    job=data[0] if isinstance(data,list) else data
    if job['status']!='completed': raise RuntimeError(job['status'])
    stem=jobfile.name.replace('-job.json','')
    original=raw/(stem+'-original.png')
    urllib.request.urlretrieve(job['result_url'],original)
    target=folder/(stem+'-human.jpg')
    with Image.open(original) as im:
        im.convert('RGB').save(target,quality=95,subsampling=0,optimize=True)
        size=im.size
    receipts.append(dict(file=target.relative_to(root).as_posix(),provider='Higgsfield',model=job.get('job_type','gpt_image_2'),jobId=job['id'],createdAt=job['created_at'],status=job['status'],promptFile=(folder/(stem+'-prompt.txt')).relative_to(root).as_posix(),sourceOriginalSha256=hashlib.sha256(original.read_bytes()).hexdigest(),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),dimensions=list(size),finishing='Provider original converted to JPEG quality 95, no crop, colour change, typography or logo generation.',rightsStatus='Generated illustrative image; provider terms apply. No customer, named person or actual deployment represented. Existing campaign release review retained.',referenceImages=[]))
    jobfile.rename(raw/jobfile.name)
    print(stem,size,target.stat().st_size)
(root/'carousel-generation-receipts.json').write_text(json.dumps(receipts,indent=2)+'\n',encoding='utf-8')
