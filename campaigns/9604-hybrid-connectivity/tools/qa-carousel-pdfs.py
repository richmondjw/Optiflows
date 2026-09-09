import json, hashlib, zipfile
from pathlib import Path
import fitz
from PIL import Image, ImageChops, ImageStat
root=Path(__file__).resolve().parents[1]
out=root/'tmp/pdf-qa';out.mkdir(parents=True,exist_ok=True)
results=[]
ids=['asset-tracking','agtech','environmental','remote-equipment','field-safety']
for cid in ids:
    for variant in ['', '-co-branded']:
        pdf=root/f'downloads/{cid}{variant}-linkedin-document.pdf'
        doc=fitz.open(pdf);assert len(doc)==5
        sheet=Image.new('RGB',(1620,405),'white')
        for n,page in enumerate(doc,1):
            pix=page.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
            im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
            assert im.size==(1080,1350)
            source=root/'assets/carousels'/('co-branded' if variant else '')/f'{cid}-{n:02}.webp'
            with Image.open(source) as original:
                error=sum(ImageStat.Stat(ImageChops.difference(im,original.convert('RGB'))).mean)/3
            assert error<3, (cid,variant,n,error)
            im.save(out/f'{cid}{variant}-{n:02}.png')
            sheet.paste(im.resize((324,405)),((n-1)*324,0))
            results.append(dict(pdf=pdf.name,page=n,width=1080,height=1350,meanChannelError=round(error,4)))
        sheet.save(out/f'{cid}{variant}-overview.jpg',quality=95)
manifest=json.loads((root/'downloads/publishing-manifest.json').read_text(encoding='utf-8'))
for row in manifest['files']:
    p=root/row['file'];assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],p
zips=list((root/'downloads').glob('*kit.zip'))
for p in zips:
    with zipfile.ZipFile(p) as z:assert z.testzip() is None,p
report=dict(pdfCount=10,pages=50,manifestRows=len(manifest['files']),zipCount=len(zips),zipCrc='pass',pagesDetail=results)
(out/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='pagesDetail'}))
