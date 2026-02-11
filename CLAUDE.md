# EVA — Project Context

## What is EVA

EVA is a women-centered community ecosystem based in Italy. It creates curated, beautiful experiences — local gatherings, immersive journeys, and a digital continuity layer — where women reconnect to themselves through connection, beauty, movement, and reflection.

EVA is **not** a spiritual circle brand, not an event brand. It's a living community engine.

## Why EVA

The name EVA is a reclaiming. For centuries, Eva was framed as the woman who "made a mistake" — the one who took the apple, who disobeyed. But without the weight of guilt, what remains is a woman who made a choice. The point was always the act of choosing.

EVA is for women who decide to live consciously — in relationships, in work, in how they spend their time and energy. A space for clarity, alignment, and self-respect. To see clearly and choose well, one step at a time. Quietly. Honestly. On their own terms.

## Values

Courage, Authenticity, Beauty, Connection, Nature, Joy, Generosity, Craft, Intentionality, Rootedness. Full descriptions in `EVA_SYSTEM_BRIEF.md`.

## Project Structure

```
EVA/
├── CLAUDE.md                  # This file
├── EVA_SYSTEM_BRIEF.md        # Vision, principles, offer layers, positioning
├── dashboard/                 # Admin dashboard (in progress)
└── sprints/
    └── 01_genova_gathering/
        ├── SPRINT_BRIEF.md    # Sprint status, open decisions, deliverables
        ├── EVENT_DESIGN.md    # Full event design: flow, partners, corners, marketing
        ├── PERSONAS.md        # 5 archetipi + personas (Giulia, Francesca, Sara, Marta, Silvana)
        └── teaser/
            ├── index.html     # Landing page (single-file, no build tools)
            ├── eva-eye.png    # Logo/icon asset
            ├── alice.png      # Founder photo (color-corrected)
            ├── campanello.jpg # Doorbell photo (tonalized)
            ├── dimora-salotto.jpg # Venue living room
            ├── tarocchi.jpg   # Tarot cards photo
            ├── te-salotto.jpg # Tea cups photo (tonalized)
            ├── Boheme Floral.ttf  # Custom font for hero tagline
            └── RareBird.otf   # Custom font (alternative)
```

## Core Principles (always respect these)

- **Community-first:** real connection, sisterhood, belonging
- **Lightness + depth:** meaningful without being heavy or therapy-like
- **Experience over talk:** no stage talks, no long panels — small-group exchange
- **"Salotto" energy:** curated, feminine, stylish, comfortable, refined
- **Practical magic:** spirituality is subtle and embodied, never forced
- **All women are welcome** — not age-gated
- **Impact-oriented:** ethical choices, accessibility, local collaborations

## Tone & Language

- **Warm, elegant, poetic-but-grounded**
- No guru language, no cringe marketing, no sales pressure
- Everything should feel invitational, magnetic, and human
- Primary language: **Italian** (the event is in Genova)
- Avoid: spiritual clichés, heavy therapy framing, "healing container" jargon, conference-style programming, sales funnels, urgency pressure, fake scarcity

## Current Sprint: First Genova Gathering

- **Theme:** "Bellezza che Nutre" — Beauty as Nourishment
- **Date:** 14 March 2026 (Saturday)
- **Time:** ~14:00–19:00
- **Venue:** Historic apartment, centro storico Genova (Carignano area)
- **Capacity:** ~25 women
- **Access:** Free for participants; vendors pay a low participation fee
- **Key features:** Il Rito delle Quattro (shared tea moment), 6 curated rooms: Profumi e cose belle, Mani che creano, La stanza della bellezza, Le carte se ti va, Qualcosa di dolce, Il rito delle quattro

## Technical Notes

- The teaser site (`sprints/01_genova_gathering/teaser/index.html`) is a **single static HTML file** — no framework, no build step, no dependencies
- Fonts: Cormorant Garamond (serif) + Outfit (sans-serif) + Josefin Sans (hero subtitles) via Google Fonts; Boheme Floral (custom, local .ttf for hero tagline)
- Color palette: dark hero (night sky) transitioning to warm body (cream/earth tones), gold accent (#c4a882 / `--muted-gold`), ochre (#C9A84C)
- CSS is embedded in `<style>` — keep it that way for simplicity
- Scroll-triggered fade-in animations via IntersectionObserver
- Registration form submits to `http://localhost:3010/api/registration`
- Section order: Hero → Il Primo Incontro → Cosa Troverai (mosaic + dimora rooms side by side) → Come Funziona → Chi c'è dietro EVA → Ti ci vedi? → La Comunità → FAQ (accordion) → CTA Finale → Footer
- Photo tonalization: PIL pipeline (desaturate → gold overlay → cream overlay → channel shift → brightness)

## Output Formats (when producing content)

- Clear bullet plans
- Step-by-step flows (user journey + event journey)
- Copy blocks ready to use (landing page sections, event descriptions, IG captions)
- Checklists and run-of-show documents
- Always in Italian unless explicitly asked otherwise
