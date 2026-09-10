# Design system

## Direction

An internal production console with an editorial level of hierarchy: deep teal workspace, warm paper surface, orange decision accents, and compact operational metadata. The visual reference is a technical field notebook rather than a SaaS template.

## Tokens

- Ink: `#102f36`
- Deep teal: `#073b43`
- Teal: `#0c8a86`
- Signal orange: `#f26b38`
- Paper: `#f7f4ee`
- Mist: `#e8efed`
- Rule: `#ccd9d5`
- Muted: `#5b6d70`
- Success: `#287a5b`
- Warning: `#a75b21`

Use `Manrope` for interface copy and `Roboto Mono` for IDs, statuses and evidence metadata. Keep labels short and sentence case. Use one strong action per panel.

## Components

The shell is a responsive three-column layout: stage rail, working form, and compiled pack preview. Sections are progressive rather than modal. Cards are used for distinct decisions, with 10px corners and 1px rules; avoid floating card piles. Status is expressed with text plus colour and icon.

## Motion

Use short opacity/translate transitions for section changes and preview updates. Respect `prefers-reduced-motion`.
