## Goal

Rebuild `src/pages/Landing.tsx` in the spirit of NotebookLM's landing — a calm, centered, editorial product page anchored by ONE giant headline, a single primary CTA, and a hero product visual — but rendered in our Stellar Mercury dark/chrome aesthetic instead of NotebookLM's light look.

The current `Landing.tsx` is a dashboard clone. We're replacing it with a true marketing landing that *features* the product, not mimics its workspace pixel-for-pixel.

## Structure (top → bottom)

```
┌─────────────────────────────────────────────┐
│ NAV  SpeakMaster · Overview · Plans · [App] │  slim top bar
├─────────────────────────────────────────────┤
│                                             │
│            Master  Speaking                 │  giant centered H1
│            (mercury gradient on word 2)     │  Syncopate, huge
│                                             │
│      Your AI IELTS coach, grounded in       │  muted subhead
│      real-time speech analysis.             │
│                                             │
│              [ Try SpeakMaster ]            │  single chrome CTA
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   ┌───────────────────────────────────┐     │
│   │   HERO PRODUCT FRAME              │     │  dark chrome card,
│   │   VocalizerCard + live waveform   │     │  glow, ambient blur
│   │   + sample telemetry strip        │     │
│   └───────────────────────────────────┘     │
│                                             │
├─────────────────────────────────────────────┤
│           Speak. Analyze. Improve.          │  section heading
│                                             │
│   [icon]         [icon]         [icon]      │  3-col feature row
│   Speak          Analyze        Improve     │  (mirrors NotebookLM
│   copy…         copy…           copy…       │   "Upload your sources")
│                                             │
├─────────────────────────────────────────────┤
│         How people are using SpeakMaster    │
│   [Power study] [Mock exams] [Fluency]      │  3 use-case columns
├─────────────────────────────────────────────┤
│              Final CTA chrome card          │
│              Footer                         │
└─────────────────────────────────────────────┘
```

## Key design moves (Stellar Mercury reinterpretation)

- **Hero**: one massive centered headline (`text-[clamp(3rem,10vw,8rem)]` Syncopate), `text-mercury` on the keyword. Below: one short subhead + ONE pill CTA (`btn-mercury`). No metric grid, no second CTA, no VocalizerCard up here — restraint is the point.
- **Product visual sits BELOW the hero** in its own chrome-card frame, the way NotebookLM puts the dark app preview under "Try NotebookLM". This is where `VocalizerCard` + a sample telemetry strip lives. Heavy ambient blur glow behind it.
- **Feature trio** ("Speak / Analyze / Improve"): clean 3-column with single Lucide icon at top, short title, short paragraph — matches NotebookLM's "Upload your sources" rhythm. Use existing `chrome-card` or a lighter borderless variant.
- **Use cases** ("How people use SpeakMaster"): 3 columns — Power study (IELTS prep), Mock exams (live AI examiner), Fluency rebuild (Stammer Shield). Italic tagline at bottom of each, NotebookLM-style.
- **Final CTA + footer** stay (already strong).

## What's removed vs current Landing.tsx

- The 7-card "Training Protocols" grid (too dashboard-y for this direction; protocols live inside the app)
- The "Operating Sequence" 3-card section (folded into the 3-feature trio)
- The standalone "Live Telemetry" section (folded into hero product frame)
- The dual-CTA + metric row in hero (collapsed to one CTA)

## Files

- **Rewrite** `src/pages/Landing.tsx` — single file, all sections above.
- No new components, no new deps, no routing changes, no backend changes.
- Reuses: `StatusBadge`, `VocalizerCard`, `MetricCard`, existing `chrome-card` / `btn-mercury` / `text-mercury` tokens, Lucide icons.

## SEO

Keep single H1 ("Master Speaking." or similar), update `<title>` in `index.html` only if user asks — current title already fits.

## Out of scope

Pricing, testimonials, blog, new images, auth changes, edge functions, schema changes.
