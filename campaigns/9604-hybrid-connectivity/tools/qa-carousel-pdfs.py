import json, hashlib, zipfile
from pathlib import Path
import fitz
from PIL import Image, ImageChops, ImageStat
root=Path(__file__).resolve().parents[1]
out=root/'tmp/pdf-qa';out.mkdir(parents=True,exist_ok=True)
results=[]
ids=['asset-tracking','agtech','environmental','remote-equipment','field-safety']
variants=[('', '', 'm2m-connectivity', 'M2M Connectivity'), ('m2m-one', '-m2m-one', 'm2m-one', 'M2M One')]
expected_slides={f'{cid}-{n:02}.webp' for cid in ids for n in range(1,6)}
assert not (root/'assets/carousels/co-branded').exists(), 'Superseded generated artwork remains'
assert not list((root/'downloads').glob('*co-branded*')), 'Superseded generated downloads remain'
assert not list((root/'downloads/publishing-kit/carousels').glob('*/co-branded')), 'Superseded generated package folders remain'
for directory, _, _, _ in variants:
    assert {p.name for p in (root/'assets/carousels'/directory).glob('*.webp')}==expected_slides
expected_pdfs={f'{cid}{suffix}-linkedin-document.pdf' for cid in ids for _,suffix,_,_ in variants}
assert {p.name for p in (root/'downloads').glob('*-linkedin-document.pdf')}==expected_pdfs
for cid in ids:
    for directory, variant, slug, label in variants:
        pdf=root/f'downloads/{cid}{variant}-linkedin-document.pdf'
        doc=fitz.open(pdf);assert len(doc)==5
        assert doc.metadata['author']==label and doc.metadata['title'].endswith(' — '+label), pdf
        sheet=Image.new('RGB',(1620,405),'white')
        for n,page in enumerate(doc,1):
            pix=page.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
            im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
            assert im.size==(1080,1350)
            source=root/'assets/carousels'/directory/f'{cid}-{n:02}.webp'
            with Image.open(source) as original:
                error=sum(ImageStat.Stat(ImageChops.difference(im,original.convert('RGB'))).mean)/3
            assert error<3, (cid,variant,n,error)
            im.save(out/f'{cid}{variant}-{n:02}.png')
            sheet.paste(im.resize((324,405)),((n-1)*324,0))
            results.append(dict(pdf=pdf.name,page=n,width=1080,height=1350,meanChannelError=round(error,4)))
        sheet.save(out/f'{cid}{variant}-overview.jpg',quality=95)
        doc.close()
        folder=root/'downloads/publishing-kit/carousels'/cid/directory
        expected_members={*(f'{cid}-{n:02}.png' for n in range(1,6)),pdf.name,'caption.txt','source-copy.json','README.txt','BRAND-VERSION.txt'}
        archive=root/f'downloads/{cid}-{slug}-carousel-kit.zip'
        with zipfile.ZipFile(archive) as z:
            assert set(z.namelist())==expected_members, (archive,z.namelist())
            assert z.testzip() is None, archive
            for name in expected_members:
                assert z.read(name)==(folder/name).read_bytes(), (archive,name)
            assert z.read(pdf.name)==pdf.read_bytes(),archive
            assert (label+' independent version').encode() in z.read('README.txt'),archive
            assert z.read('BRAND-VERSION.txt').decode().startswith(label+' version.'),archive
        for n in range(1,6):
            with Image.open(folder/f'{cid}-{n:02}.png') as png, Image.open(root/'assets/carousels'/directory/f'{cid}-{n:02}.webp') as webp:
                assert png.size==(1080,1350) and png.convert('RGBA').tobytes()==webp.convert('RGBA').tobytes(), (cid,label,n)
    with zipfile.ZipFile(root/f'downloads/{cid}-carousel-kit.zip') as z:
        assert len([n for n in z.namelist() if n.endswith('.png')])==10,cid
        assert len([n for n in z.namelist() if n.endswith('.pdf')])==2,cid
        assert len([n for n in z.namelist() if n.startswith('m2m-one/')])==10,cid
manifest=json.loads((root/'downloads/publishing-manifest.json').read_text(encoding='utf-8'))
for row in manifest['files']:
    assert 'co-branded' not in row['file'] and 'co-branded' not in row.get('archive_path',''),row
    p=root/row['file'];assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],p
zips=list((root/'downloads').glob('*kit.zip'))
for p in zips:
    with zipfile.ZipFile(p) as z:
        assert z.testzip() is None,p
        assert not any('co-branded' in name for name in z.namelist()),p
with zipfile.ZipFile(root/'downloads/hybrid-iot-publishing-kit.zip') as z:
    carousel_members=[n for n in z.namelist() if n.startswith('carousels/')]
    assert len([n for n in carousel_members if n.endswith('.png')])==50
    assert len([n for n in carousel_members if n.endswith('.pdf')])==10
assert len(results)==50 and len(zips)==36
report=dict(pdfCount=10,pages=50,independentBrandKits=10,brandIsolation='pass',manifestRows=len(manifest['files']),zipCount=len(zips),zipCrc='pass',pagesDetail=results)
(out/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='pagesDetail'}))
