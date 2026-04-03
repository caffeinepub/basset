# BASSET

## Current State
BASS is a sustainable fashion platform with a white/classy theme (light backgrounds, dark text). Key components:
- HeroSection: uses a parallax background image with a dark overlay (`hero-overlay`) that darkens the left side significantly (88% opacity dark)
- MaterialsSection: light `bg-background` with card grid
- AboutSection: light `py-24` section with mission text and pillar cards — but NO mention of founders
- ShopSection: `bg-secondary/30` light background
- Navigation: transparent until scrolled, then `bg-background/95`
- Footer: `bg-background` light
- index.css: `hero-overlay` uses `oklch(0.08 0.01 60 / 0.88)` to `oklch(0.1 0.01 60 / 0.65)` — very dark gradient

## Requested Changes (Diff)

### Add
- Founders section within AboutSection (or as separate section): mention Madhav Tyagi as Founder and Vishal Verma as Co-Founder with a brief intro about who BASSET is and what it stands for
- About section link in navigation

### Modify
- `hero-overlay` in index.css: replace the dark overlay with a very light or near-transparent one, so the hero image shows through clearly and dark text remains readable. Use a light white/cream gradient from left instead.
- HeroSection: change heading text colors to use `text-foreground` (dark charcoal) reliably — remove any dependency on the overlay for contrast. Consider adding a light frosted card/panel behind the text for legibility if the hero image is complex.
- AboutSection: add a founders sub-section below the existing mission content, with Founder: Madhav Tyagi and Co-Founder: Vishal Verma, and a short paragraph about BASSET's founding story
- All dark background sections: scan and replace any remaining dark backgrounds (dark overlays, dark cards) with light equivalents

### Remove
- The heavy dark hero overlay that makes the hero section look dark

## Implementation Plan
1. Update `hero-overlay` in `index.css` to use a light semi-transparent white gradient instead of a dark one, ensuring the hero image is visible and text is readable with a light backing
2. Update `HeroSection.tsx`: add a light frosted/white semi-transparent backdrop behind the text content panel so text is readable against any hero image without a dark overlay
3. Update `AboutSection.tsx`: add a Founders section below the existing mission content with Madhav Tyagi (Founder) and Vishal Verma (Co-Founder), plus a brief company intro paragraph
4. Add "About" link to Navigation pointing to the #about section
5. Validate and build
