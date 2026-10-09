# q-mp-134 — par-55 layout-read cut

## Goal

Cut layout-forcing DOM reads during moves on Par 55 without AI timing,
legal-move, rules, or copy changes (board-ui / sync only).

## Tip baseline (from `docs/dev/render-perf-2026-10-09.json`)

| Game   | layoutReadsP95 |
| ------ | -------------: |
| par-55 |             41 |

## After (this change)

Command:

```bash
PERF_MODE=render PERF_GAMES=par-55 PERF_PHASE=qmp134-after PERF_RENDER_STEM=q-mp-134-par55-layout npm run perf:runtime
```

| Game   | layoutReadsP95 |   Δ vs tip |
| ------ | -------------: | ---------: |
| par-55 |              8 | **−80.5%** |

Meets acceptance (≥30% drop). Move legality unchanged (`npm run test:unit`).

## What changed

### par-55 board-ui

- Cache `getPlayerSeatColors()` once per `renderBoard` / `syncBoard` (was
  3× `getComputedStyle` per placed block via owner rings).
- Persistent SVG + `syncBoard` for select/place updates (class markers
  `.par55-base-pent` / `.par55-base-hit` / `.par55-block-host`).
- Delegated SVG click so sync never rebinds every base group.

### par-55 game-controller

- Reuses `.par55-board` when not entering/leaving game-over; syncs chrome
  (status / scores / hands / history / controls) around the persistent board.

## Non-goals / left alone

- AI search, scoring, difficulty, timing; Hex Hard 450ms; Stars & Bars history
- Player-facing copy / rules text; `*/rules.ts` legal-move paths

## Artifact

Raw phase JSON: `docs/dev/q-mp-134-par55-layout.json` (phase `qmp134-after`).
