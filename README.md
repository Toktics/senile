# S.E.N.I.L.E. Interactive Archive (Version 1)

Immersive Next.js build for:

S.E.N.I.L.E. // Society for the Extremely Normal, Important & Little Events

## Implemented in this build

- Entry sequence: dark state, flicker atmosphere, power switch, cupboard reveal, briefing, CTA to Case Room.
- In-universe navigation labels and archive section structure.
- Core sections:
  - Case Room (Case 001 open + Case 002-010 redacted placeholders)
  - Agency Overview
  - Agent Registry
  - Equipment Division
  - Graphic Novel Division
  - Recruitment Terminal
- Optional interactive layer (non-blocking):
  - UV Torch unlock
  - UV code reveal (`0712`)
  - Director cabinet unlock
  - Sublevel keycard unlock
  - Decoder lens reveal line
- Browser state persistence using `localStorage`:
  - `uvUnlocked`
  - `cabinetUnlocked`
  - `sublevelUnlocked`

## CMS-ready content zones

These collections are isolated and ready to map to a headless CMS:

- `CaseFiles`
- `Books`
- `Characters`
- `Gadgets`
- `SiteCopy`

Current local source files:

- `src/content/types.ts`
- `src/content/archive-data.ts`

Experience mechanics intentionally remain in code:

- power restoration sequence
- puzzle/unlock logic
- navigation architecture
- atmosphere and UI behavior

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Recommended CMS direction

For weekly updates with structured content and future unlock states, Sanity is the strongest fit.

If you prefer visual page editing over structured modeling, Storyblok is the better fit.

Either way, keep interaction state and puzzle logic in code, and migrate only collection content into CMS.
