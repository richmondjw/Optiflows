#!/usr/bin/env python3
"""Build clean platform packs from the retained Spring review exports."""

from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "assets" / "exports"
OUT = ROOT / "production"
WEEKS = {"s1": "Paper before lunch", "s2": "One walk, two lengths", "s3": "Choose the day shape", "s4": "The Spring reset weekend"}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "sora-700.woff2" if bold else "figtree-600.woff2"
    return ImageFont.truetype(str(ROOT / "assets" / "fonts" / name), size)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clean_slide(source: Path, destination: Path, size: tuple[int, int]) -> None:
    image = Image.open(source).convert("RGB").resize(size, Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(image, "RGBA")
    width, height = image.size
    chip = (int(width * .625), int(height * .035), int(width * .965), int(height * .095))
    draw.rounded_rectangle(chip, radius=14, fill=(11, 46, 74, 255), outline=(245, 193, 119, 255), width=2)
    draw.text((chip[0] + 14, chip[1] + 14), "PENINSULA INSIDER · SPRING 2026", font=font(max(14, width // 64), True), fill=(255, 255, 255, 255))
    footer = (int(width * .745), int(height * .915), int(width * .972), int(height * .975))
    draw.rounded_rectangle(footer, radius=12, fill=(11, 46, 74, 255))
    draw.text((footer[0] + 14, footer[1] + 14), "SPRING 2026 · PRODUCTION", font=font(max(13, width // 70), True), fill=(255, 255, 255, 255))
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "JPEG", quality=94, optimize=True, progressive=True)


def make_pdf(slides: list[Path], destination: Path) -> None:
    pages = [Image.open(path).convert("RGB") for path in slides]
    pages[0].save(destination, "PDF", resolution=144, save_all=True, append_images=pages[1:])


def make_zip(files: list[Path], destination: Path, prefix: str) -> None:
    with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, f"{prefix}/{path.name}")


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    manifest = {"campaign": "Peninsula Insider Spring 2026", "status": "draft-ready", "weeks": []}
    for week, title in WEEKS.items():
        week_dir = OUT / week
        ig_files, fb_files, li_files = [], [], []
        for index in range(1, 6):
            source = SOURCE / f"{week}-feed-{index:02d}.webp"
            ig = week_dir / "instagram" / f"{index:02d}-{week}-instagram-1080x1350.jpg"
            fb = week_dir / "facebook" / f"{index:02d}-{week}-facebook-1200x1500.jpg"
            li = week_dir / "linkedin" / f"{index:02d}-{week}-linkedin-1200x1500.jpg"
            clean_slide(source, ig, (1080, 1350)); clean_slide(source, fb, (1200, 1500)); clean_slide(source, li, (1200, 1500))
            ig_files.append(ig); fb_files.append(fb); li_files.append(li)
        ig_pdf = week_dir / f"{week}-instagram-carousel-proof.pdf"
        fb_pdf = week_dir / f"{week}-facebook-carousel-proof.pdf"
        li_pdf = week_dir / f"{week}-linkedin-document-carousel.pdf"
        make_pdf(ig_files, ig_pdf); make_pdf(fb_files, fb_pdf); make_pdf(li_files, li_pdf)
        ig_zip = week_dir / f"{week}-instagram-posting-pack.zip"
        fb_zip = week_dir / f"{week}-facebook-posting-pack.zip"
        li_zip = week_dir / f"{week}-linkedin-document-pack.zip"
        make_zip(ig_files + [ig_pdf], ig_zip, f"{week}-instagram")
        make_zip(fb_files + [fb_pdf], fb_zip, f"{week}-facebook")
        make_zip(li_files + [li_pdf], li_zip, f"{week}-linkedin")
        manifest["weeks"].append({"id": week, "title": title,
            "instagram": {"slides": [str(p.relative_to(ROOT)) for p in ig_files], "proof_pdf": str(ig_pdf.relative_to(ROOT)), "zip": str(ig_zip.relative_to(ROOT))},
            "facebook": {"slides": [str(p.relative_to(ROOT)) for p in fb_files], "proof_pdf": str(fb_pdf.relative_to(ROOT)), "zip": str(fb_zip.relative_to(ROOT))},
            "linkedin": {"slides": [str(p.relative_to(ROOT)) for p in li_files], "document_pdf": str(li_pdf.relative_to(ROOT)), "zip": str(li_zip.relative_to(ROOT))}})
    files = sorted(path for path in OUT.rglob("*") if path.is_file())
    manifest["files"] = [{"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size, "sha256": sha256(path)} for path in files]
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
