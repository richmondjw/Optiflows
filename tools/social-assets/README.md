# Social Asset Engine

Code-native branded asset renderer for OptiFlows-style social content.

## Current scope
- Instagram carousel rendering to PNG
- Structured JSON input
- Reusable branded HTML/CSS templates
- Output manifest and per-slide images

## Usage
```bash
npm install
npm run assets:test
```

Or run with a custom payload:
```bash
node tools/social-assets/render.js --input path/to/payload.json --output path/to/output-dir
```

## Input shape
See `examples/optiflows-carousel.json`.

## Output
- `index.html` preview file
- `slide-01.png`, `slide-02.png`, ...
- `manifest.json`

## Design approach
- code-native templates
- brand tokens in CSS
- deterministic output for agent workflows
- versionable in git
