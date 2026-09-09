#!/usr/bin/env python3
from pathlib import Path
import pymupdf

root = Path(__file__).resolve().parent.parent
pdf_path = root / "downloads" / "hybrid-iot-readiness-guide.pdf"
output = root / "tmp" / "pdfs"
output.mkdir(parents=True, exist_ok=True)

document = pymupdf.open(pdf_path)
print(f"pages={document.page_count}")
for number, page in enumerate(document, start=1):
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(1.4, 1.4), alpha=False)
    pixmap.save(output / f"readiness-{number:02d}.png")
print(f"rendered={document.page_count}")
