
# Product-First Landing Page

Build a public landing route that looks and feels like the real SpeakMaster Command Center — same Stellar Mercury aesthetic, same layout primitives, same components — but populated with demo/marketing content and routed to sign-up CTAs instead of live actions.

## Goal

When a visitor lands on `/`, they should immediately *see the product*: the cosmic background, chrome glass cards, vocalizer card, practice module grid, HUD telemetry — not a generic marketing hero. The dashboard *is* the pitch.

## Routing changes

- `/` (Index) → new `Landing` page when user is **logged out**.
- Logged-in users keep getting `Dashboard` at `/`.
- Add `/app` as an explicit alias for the authenticated dashboard.
- All CTAs ("Begin Training", "Start Free", module cards) on the landing page route to `/auth` for logged-out visitors.

## Page structure (`src/pages/Landing.tsx`)

Mirrors `Dashboard.tsx` section-for-section, then adds light marketing scaffolding underneath. All sections use existing components (`StatusBadge`, `VocalizerCard`, `PracticeCard`, `MetricCard`, `CosmicBackground`) so the look is identical.

```text
┌─────────────────────────────────────────────────┐
│ NAV (logo + Sign in / Get Started)              │
├─────────────────────────────────────────────────┤
│ HERO  (mirrors Dashboard hero)                  │
│  ┌──────────────┐  ┌────────────────┐          │
│  │ STATUS badge │  │                │          │
│  │ COMMAND      │  │  VocalizerCard │          │
│  │ CENTER.      │  │  (demo numbers)│          │
│  │ subcopy      │  │                │          │
│  │ [Start Free] │  └────────────────┘          │
│  │ [Watch demo] │                               │
│  │ MetricCards  │                               │
│  └──────────────┘                               │
├─────────────────────────────────────────────────┤
│ TRAINING PROTOCOLS  (same 7-card grid, demo)    │
├─────────────────────────────────────────────────┤
│ HOW IT WORKS  (3 steps using practice-card look)│
├─────────────────────────────────────────────────┤
│ TELEMETRY PREVIEW  (analytics/HUD chrome strip) │
├─────────────────────────────────────────────────┤
│ FINAL CTA  (big chrome card → /auth)            │
├─────────────────────────────────────────────────┤
│ FOOTER  (same as Dashboard footer)              │
└─────────────────────────────────────────────────┘
```

### Hero
- Reuse `StatusBadge`, headline typography, `VocalizerCard` populated with realistic demo telemetry (band 7.5, fluency 82, lexical 76, resonance 88).
- `MetricCard` row shows aspirational sample stats labeled "Sample telemetry" via a small caption.
- Primary CTA "Start Free" → `/auth`; secondary "Watch tutorial" → `/tutorial`.

### Training protocols
- Same 7 modules from `Dashboard.tsx`, same icons/copy, but rendered through a non-link wrapper so unauth clicks route to `/auth` (pass `path="/auth"` to `PracticeCard` for all modules).

### How it works
- Three steps in chrome cards: 1) Speak into a live protocol, 2) AI scores fluency, lexical, pronunciation, coherence, 3) Track XP and band progression.

### Telemetry preview
- Static HUD-style strip echoing Analytics page styling (no real data fetch) to hint at the analytics depth.

### Final CTA
- Large chrome glass card: "Initiate your IELTS protocol." + `[Begin Training]` → `/auth`.

### Footer
- Reuses the Dashboard footer block verbatim.

## SEO
- `<title>` ~ "SpeakMaster — AI IELTS Speaking Coach"
- meta description ~155 chars
- single H1: "COMMAND CENTER."
- canonical + viewport already present in `index.html`.

## Technical notes

- New file: `src/pages/Landing.tsx`. No backend changes, no new dependencies.
- `src/pages/Index.tsx`: branch on `useAuth().user` — render `Landing` when no user, `Dashboard` when authenticated. Keep `ApiKeySetup` only for authed users.
- `src/App.tsx`: add `/app` route → `Dashboard` (wrapped in existing auth guard pattern).
- Reuses semantic tokens; no raw colors. No business logic touched (auth, edge functions, hooks untouched).
- `useRealtimeStats` is NOT called on the landing page — demo numbers are hardcoded to avoid Supabase calls for anonymous visitors.

## Out of scope
- No pricing, testimonials, or blog sections (product-first, not marketing-heavy).
- No changes to edge functions, RLS, or schema.
- No new images generated; relies on existing CosmicBackground + chrome card styling.
