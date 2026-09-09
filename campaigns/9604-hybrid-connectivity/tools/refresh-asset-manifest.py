"""Refresh source manifest from actual delivery bytes after building the kit."""
import hashlib, json
from datetime import datetime, timezone
from pathlib import Path
from collections import Counter
from PIL import Image

root = Path(__file__).resolve().parents[1]
target = root / 'asset-manifest.json'
manifest = json.loads(target.read_text(encoding='utf-8'))
old = {row['file']: row for row in manifest['files']}
rows = []
for file in sorted(root.rglob('*')):
    if not file.is_file():
        continue
    name = file.relative_to(root).as_posix()
    if name == 'asset-manifest.json' or name.startswith(('tmp/', 'assets/reference-art/', 'downloads/verification/')) or '__pycache__' in name:
        continue
    row = dict(old.get(name, {'file': name, 'category': 'download' if name.startswith('downloads/') else 'production-tool' if name.startswith('tools/') else 'campaign-source'}))
    row.update(bytes=file.stat().st_size, sha256=hashlib.sha256(file.read_bytes()).hexdigest())
    row['dimensions'] = None
    if file.suffix.lower() in ('.png', '.webp', '.jpg'):
        with Image.open(file) as image:
            row['dimensions'] = dict(width=image.width, height=image.height)
    rows.append(row)
manifest.update(generatedAt=datetime.now(timezone.utc).isoformat(), files=rows,
                totalFiles=len(rows), totalBytes=sum(row['bytes'] for row in rows),
                counts=dict(Counter(row['category'] for row in rows)))
manifest['exclusions'].append('downloads/verification/** visual QA working files')
target.write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8', newline='\n')
print(f'Refreshed {len(rows)} asset records')
