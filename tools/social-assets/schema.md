# Social Asset Payload Schema

## Top-level fields
- `title`: Human-readable title for the run
- `brand`: Brand pack ID, for example `optiflows`
- `format`: Asset format family, for example `instagram-carousel`
- `size.width`: Export width in pixels
- `size.height`: Export height in pixels
- `slides`: Ordered list of slides/items
- `output.baseName`: Base name used for output files

## Slide fields
- `variant`: `cover`, `body`, `cta`, or future template variant
- `headline`: Primary text
- `subhead`: Supporting text for `cover` or `cta`
- `body`: Main body text for `body`
- `cta`: CTA treatment for `cta`

## Output contract
Each run should produce:
- preview HTML
- per-slide PNGs
- PDF export
- manifest JSON
