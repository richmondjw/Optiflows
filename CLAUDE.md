# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Optiflows marketing website — a static single-page landing site for a B2B growth operating model consultancy. Live at **www.optiflows.com.au**, hosted on GitHub Pages.

## Deployment

Push to `main` triggers automatic deployment via `.github/workflows/static.yml` (GitHub Pages). There is no build step — the entire repo root is deployed as-is.

```sh
git push origin main   # deploys to production
```

There is no dev server, build system, linter, or test suite. This is a static HTML site.

## Architecture

**Single-file site:** Everything lives in `index.html` (~2100 lines) — CSS, HTML, and JavaScript inline. No external dependencies except the Switzer font from FontShare.

### Structure within index.html

1. **`<style>`** — All CSS including custom properties, component styles, responsive breakpoints
2. **Password gate** — `<div id="passwordGate">` fixed overlay, password: `1xlx1`, uses `sessionStorage`
3. **`<div id="siteContent">`** — All page content, hidden until password gate clears
4. **`<script>`** (inside siteContent) — Form wizard logic, FAQ accordion, mobile menu
5. **`<script>`** (after siteContent) — Password gate logic, `sessionStorage` check

### Key sections in order
Nav → Hero → Credibility Bar → The Growth Ceiling (stat) → Two Loops (SVG diagrams) → Engagement (3-phase model) → Proof (outcome cards) → Diagnostic (architecture session pitch) → Apply (8-step form wizard) → FAQ → Final CTA → Contact (form) → Footer

### Forms

Two forms, both POST to **Formspree** endpoint `https://formspree.io/f/meelyrkd` (emails james.richmond@optiflows.com.au):

- **Audit wizard** (8-step, section `#apply`): Collects team_size, growth_system, primary_challenge, operating_model, campaign_planning, success_vision, company, name, email, phone. Subject line: "Optiflows lead submission"
- **Contact form** (section `#contact`): Collects name, email, message. Subject line: "Optiflows contact form"

### Design system

- **Font:** Switzer (neo-grotesk) from FontShare — single typeface, all weights
- **Color:** Deep teal system — accent `#0D7377`, text `#1C2127`, surfaces `#F4F5F6`/`#EAECEE`
- **CSS custom properties** on `:root` control all spacing, type scale, and colors
- **Visual style:** Rounded corners (LinkedIn lead-gen form aesthetic) — pill buttons (28px radius), rounded inputs/cards (8-12px), subtle shadows
- **Responsive:** Mobile breakpoint at 768px, clamp-based fluid typography and spacing

### Brand assets

`images/` contains the full brand kit: logos (BLK/White, SVG+PNG), horizontal lockups, favicons, asset pack, and brand guidelines docx. The nav/password gate use `images/png/optiflows-lockup-horizontal-dark.png`.

## Important context

- **CNAME** file contains `www.optiflows.com.au` — do not remove or the custom domain breaks
- **Password gate** is intentional — site is in pre-launch/review mode
- **No em dashes** in copy — all have been deliberately replaced with hyphens
- **Copy positioning:** Optiflows is a systems-led growth consultancy, not a marketing agency. The core language is "operating system behind growth", "operating model install", "architecture session". Preserve this positioning vocabulary.
- **Formspree endpoint** is production — test carefully, submissions go to real email
- **Two inline SVGs** in the Two Loops section (founder bottleneck loop + operating model loop) — edit coordinates carefully
