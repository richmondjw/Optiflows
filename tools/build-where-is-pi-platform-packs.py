#!/usr/bin/env python3
"""Build production-ready Where Is PI carousel packs for three platforms."""

from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CAMPAIGN = ROOT / "campaigns" / "peninsula-insider-where-is-pi"
SOURCE = CAMPAIGN / "assets" / "exports" / "release" / "jpg"
OUTPUT = CAMPAIGN / "assets" / "downloads" / "platforms"
SLIDES = [
    "carousel-01-hook.jpg",
    "carousel-02-case.jpg",
    "carousel-03-mechanic.jpg",
    "carousel-04-witness.jpg",
    "carousel-05-cta.jpg",
]
PLATFORMS = {
    "instagram": {
        "size": (1080, 1350),
        "pdf": "where-is-pi-instagram-carousel-proof.pdf",
        "zip": "where-is-pi-instagram-production-pack.zip",
        "instructions": "Upload the five JPG slides to the Instagram carousel draft in numbered order. The PDF is a proof only; Instagram publishing uses the JPG slides.",
    },
    "facebook": {
        "size": (1200, 1500),
        "pdf": "where-is-pi-facebook-carousel-proof.pdf",
        "zip": "where-is-pi-facebook-production-pack.zip",
        "instructions": "Upload the five JPG slides to the Facebook carousel draft in numbered order. The PDF is a proof only; Facebook publishing uses the JPG slides.",
    },
    "linkedin": {
        "size": (1200, 1500),
        "pdf": "where-is-pi-linkedin-document-carousel.pdf",
        "zip": "where-is-pi-linkedin-production-pack.zip",
        "instructions": "Upload the PDF to the LinkedIn draft as a document carousel. The five JPG slides are included as production sources and a fallback.",
    },
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def save_pdf(images: list[Image.Image], path: Path) -> None:
    rgb = [image.convert("RGB") for image in images]
    rgb[0].save(path, "PDF", save_all=True, append_images=rgb[1:], resolution=144.0)


def main() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    manifest = {"campaign": "Where in the Peninsula is PI?", "slideOrder": SLIDES, "platforms": {}}
    for platform, spec in PLATFORMS.items():
        platform_dir = OUTPUT / platform
        slides_dir = platform_dir / "slides"
        slides_dir.mkdir(parents=True, exist_ok=True)
        images: list[Image.Image] = []
        files = []
        for index, filename in enumerate(SLIDES, start=1):
            source = SOURCE / filename
            image = Image.open(source).convert("RGB")
            if image.size != spec["size"]:
                image = image.resize(spec["size"], Image.Resampling.LANCZOS)
            target = slides_dir / f"{index:02d}-{filename}"
            image.save(target, "JPEG", quality=94, optimize=True, progressive=True)
            images.append(image)
            files.append({
                "order": index,
                "file": target.relative_to(CAMPAIGN).as_posix(),
                "width": image.width,
                "height": image.height,
                "sha256": sha256(target),
            })
        pdf_path = platform_dir / spec["pdf"]
        save_pdf(images, pdf_path)
        readme_path = platform_dir / "README.txt"
        readme_path.write_text(
            "Where in the Peninsula is PI? — Case 01\n"
            f"{platform.title()} production carousel\n\n"
            f"{spec['instructions']}\n\n"
            "Order:\n"
            + "\n".join(f"{index:02d}. {filename}" for index, filename in enumerate(SLIDES, start=1))
            + "\n\nNothing in this pack schedules or publishes automatically. Review the draft in Buffer, choose a time, then schedule inside the authenticated Buffer workspace.\n",
            encoding="utf-8", newline="\n",
        )
        zip_path = platform_dir / spec["zip"]
        with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            archive.write(pdf_path, pdf_path.name)
            archive.write(readme_path, readme_path.name)
            for file_info in files:
                slide_path = CAMPAIGN / file_info["file"]
                archive.write(slide_path, f"slides/{slide_path.name}")
        manifest["platforms"][platform] = {
            "usage": spec["instructions"],
            "pdf": pdf_path.relative_to(CAMPAIGN).as_posix(),
            "pdfSha256": sha256(pdf_path),
            "zip": zip_path.relative_to(CAMPAIGN).as_posix(),
            "zipSha256": sha256(zip_path),
            "slides": files,
        }

    manifest_path = OUTPUT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8", newline="\n")
    checksums = []
    for path in sorted(OUTPUT.rglob("*")):
        if path.is_file() and path != OUTPUT / "SHA256SUMS.txt":
            checksums.append(f"{sha256(path)}  {path.relative_to(OUTPUT).as_posix()}")
    (OUTPUT / "SHA256SUMS.txt").write_text("\n".join(checksums) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
