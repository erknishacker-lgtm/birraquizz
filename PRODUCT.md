# Product

## Register

**brand** — design IS the product. Interactive quiz funnel that qualifies pain and converts to a paid digital product (Hotmart).

## Users & Purpose

**Who:** Mothers and fathers (primary: mobile, stressed, often late at night or mid-crisis) of children roughly 2–4 years old who have intense tantrums — at home, in public, or linked to screens and routine chaos. Caregivers who freeze, shout, or give in and later feel guilt.

**Context of use:** Phone in hand, low patience, high identification. They arrive from ads or social content about tantrums / “berrinche” / “birra”. They need to feel seen in 10 seconds.

**Job to be done:** In a few minutes, recognize “this is about me”, receive a diagnostic-style result that creates urgency to act, and click through to the offer: *Berrinche Cero en 7 Minutos* / protocol guide (checkout: https://pay.hotmart.com/P106744435B).

**Outcome emotion at the end (combined):**
1. **Urgency + relief** — “This is serious, but there is a clear path now.”
2. **Controlled shock / productive guilt** — “I can’t keep reacting late with the wrong script.”

The result must push toward *wanting the solution hard*, independent of which answers they marked (always lands on “you need to take action now”).

## Brand Personality

**Three words:** Firme · Práctica · Urgente

- Firm: coach energy, protocol, not fluff.
- Practical: phrases, checklists, minute-by-minute — not abstract theory.
- Urgent: every day of chaos costs energy; the CTA is “now”.

**Voice:** Direct Spanish/Portuguese/English parenting copy. Empathetic without softness that excuses inaction. No medical diagnosis claims; no “magic fix without applying anything”.

**Languages:** Full UI + questions + result in **Português (BR), Español, English**, with an obvious language selector (mobile-first).

## Visual & Scene Direction (strategic, not tokens)

**Physical scene:** Parent on a phone under kitchen light or after a public meltdown — needs calm colors that still feel *adult and professional*, not a baby-product store. Acolhimento (welcome) through soft blue + white + warm yellow accents, while structure and motion feel premium and conversion-focused.

**Anti-references (must not look like):**
- Pastel Instagram “mommy blog” (cursive, pink fluff, stock-perfect nursery).
- Clinical hospital / therapy form (cold blue-gray laudos).
- Cheap clickbait quiz (fake timers, neon CTAs, popup spam).

**Must feel:** Mobile-first, obvious (obvious navigation), professional, high identification via situational imagery (home meltdown, supermarket floor, screen time fight).

## Product Surface

### Quiz (root `/`)

1. Landing / hook (hero + start CTA)
2. Language selector: **ES / PT / EN** (default ES)
3. **12 questions** + images
4. News interstitials after Q4 / Q8 / Q12
5. Loading ~3s
6. Result + CTA Hotmart

### Funnel pages (same brand system)

| Route | Role |
|-------|------|
| `/obrigado/` | Thank-you after purchase |
| `/upsell/` | Add-on **Implementación Rápida** (scripts, checklists, decision map) |
| `/downsell/` | Lower offer **Protocolo Núcleo 7 Minutos** after full-guide rejection |

Scoring only personalizes tags; **every quiz path ends with: act now / you need the protocol**.

## Accessibility & Constraints

- **Primary viewport:** mobile 100% priority; desktop acceptable but secondary.
- Readable contrast, large tap targets, clear progress.
- Respect `prefers-reduced-motion`.
- Professional clarity over decoration.

## Success Criteria

- Parent self-identifies within the first 1–2 questions.
- Quiz feels beautiful and intentional (not a form template).
- Result creates urgency + desire for the 7-minute protocol.
- Primary CTA always goes to `https://pay.hotmart.com/P106744435B`.
- PT / ES / EN complete and switchable.

## Strategic Design Principles

1. **Identification before education** — show the scene of their life before teaching.
2. **One decision per screen** — mobile quiz rhythm, not long pages of options.
3. **Diagnosis sells the protocol** — result names the pattern (late reaction, wrong script, screens, public freeze) then offers the fix.
4. **Warm palette, firm voice** — baby blue / white / yellow for welcome; copy and structure for urgency.
5. **No soft landing without CTA** — result always ends with a clear “solution” button.
