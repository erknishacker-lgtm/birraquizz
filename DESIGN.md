# Design System — Quiz Berrinche Cero

## Theme
**Name:** Calm Authority Mobile  
**Mood:** Kitchen light after a meltdown — soft baby blue welcome, honey-yellow urgency, white surfaces. Professional parent-coach, not nursery Instagram.  
**Register:** Brand / conversion quiz  
**Color strategy:** Committed — baby blue carries surfaces (~40%), honey yellow accents CTA/alerts (~15%), deep ink for authority copy.

## Colors (OKLCH)

| Role | Token | Value | Use |
|------|--------|--------|-----|
| Background | `--bg` | `oklch(0.985 0.01 230)` | App canvas (cool off-white, not cream) |
| Surface | `--surface` | `oklch(1 0 0)` | Cards, option buttons |
| Primary | `--primary` | `oklch(0.62 0.09 235)` | Baby blue brand |
| Primary deep | `--primary-deep` | `oklch(0.42 0.08 245)` | Headings, authority |
| Accent | `--accent` | `oklch(0.78 0.14 85)` | Yellow urgency, progress, badges |
| Accent hot | `--accent-hot` | `oklch(0.68 0.15 55)` | CTA hover, alert edges |
| Ink | `--ink` | `oklch(0.28 0.04 250)` | Body text |
| Muted | `--muted` | `oklch(0.48 0.03 250)` | Secondary text |
| Danger soft | `--alert` | `oklch(0.55 0.14 25)` | News/alert emphasis |
| Success soft | `--calm` | `oklch(0.55 0.08 200)` | Small relief cues |

## Typography
- **Display/UI:** `Outfit` — geometric, clear on mobile (not Inter/DM Sans reflex list… Outfit is on reject list!)

Reflex-reject includes Outfit. Use something else:
- **Display:** `Sora` — modern geometric, firm
- **Body:** `Source Sans 3` — highly readable mobile

Scale: fluid clamp, ratio ~1.25. Headings `text-wrap: balance`. Letter-spacing ≥ -0.03em on display.

## Layout
- Max content width: 430px centered
- Full-viewport quiz cards on mobile
- Large tap targets ≥ 48px
- Progress bar sticky top
- Language chips always visible

## Motion
- Card slide/fade between steps (transform + opacity)
- Progress bar width transition
- Analyze spinner pulse
- Stagger options 40ms
- `prefers-reduced-motion: reduce` → crossfade only

## Components
- Lang switcher (pill)
- Progress (thin bar + step count)
- Scene image (16:10, rounded 14px)
- Question title + helper
- Option buttons (full width, 1.5px border primary)
- News/Alert interstitial (newspaper strip + specialist quote)
- Result panel (critical badge + pills + CTA pill button)
- Primary CTA: solid primary-deep or accent-filled for conversion moments

## Imagery
Generated situational photos: home floor meltdown, supermarket, screens, public street, guilt, escalation — realistic, warm-cool, not stock-perfect nursery.
