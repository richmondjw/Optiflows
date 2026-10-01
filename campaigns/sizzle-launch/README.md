# SIZZLE launch review pack

Prepared 2026-10-01. Not published, sent or scheduled.

Open index.html locally or serve the repository and visit /campaigns/sizzle-launch/. Proposed destination is the existing OptiFlows campaign library, subject to clarification of the singular domain supplied by James. No DNS, payment or campaign publication action is performed by the builder.

## Sources and reproduction

- launch-strategy.md and campaign-copy.md are the exact independently accepted artifacts. Strategy SHA256 2fc6c2cc6daa27af7849cabe35b9061e8ba6f672c508ae772849c8e015be786a; copy SHA256 462d2cd4fc720ae5787a6eac400cb38ddd7cdbdbbd895fa376010072e9600b4d.
- source/creative.json owns campaign wording/variants. source/build.py rebuilds index.html and the3HTML creative sources. Font downloads are cached; bundled OFL licences are in assets.
- Source hero generated with built-in image_gen, not Higgsfield. Artwork is an editorial illustration, not recipe/technique proof. Full prompt in source/image-prompt.txt.
- PNG exports are browser renders of their matching HTML at1080x1080 and1080x1350. Motion is a12second silent pan/zoom of confidence-square.png, H2641080x1080,24fps; no instructional animation.
- The hero and fonts are embedded in the HTML; linked PNG/MP4 assets remain in assets. Keep the complete folder when sharing. There are no live collection forms or review submissions. Review comments should return to the originating task/thread; none are silently saved.

## Publication and rollback

Do not merge this pack into the public site until destination and review/publication intent are confirmed. Copy the intact folder to campaigns/sizzle-launch; add a library tile without replacing other campaigns. Verify exact deployed files, noindex, mobile rendering, downloads and motion playback. This does not launch the paid app.

Keep the reviewed text immutable unless re-reviewed. Correct only source/build.py or source/creative.json, then regenerate; do not hand-patch built HTML. To withdraw, remove the library link and disable that route in a scoped release; preserve the source and receipts.
