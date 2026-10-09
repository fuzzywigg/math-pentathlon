# q-mp-113 — remainder-islands / juggle layout-read cut

## Goal

Cut layout-forcing DOM reads during moves on the two worst 2D boards
(`remainder-islands`, `juggle`) without AI timing, legal-move, rules, or copy
changes (board-ui / sync only).

## Tip baseline (from `docs/dev/render-perf-2026-10.json`)

| Game              | layoutReadsP95 |
| ----------------- | -------------: |
| remainder-islands |            199 |
| juggle            |             92 |

## After (this change)

Command:

```bash
PERF_MODE=render PERF_GAMES=remainder-islands,juggle PERF_MOVES=20 PERF_PHASE=qmp113-verify npm run perf:runtime
```

| Game              | layoutReadsP95 |   Δ vs tip |
| ----------------- | -------------: | ---------: |
| remainder-islands |              7 | **−96.5%** |
| juggle            |             16 | **−82.6%** |

Both meet acceptance (≥30% drop). Move legality unchanged (`npm run test:unit`
focused + full suites).

## What changed

### remainder-islands

- Cache `getPlayerSeatColors()` once per `renderBoard` / `syncBoard` (was 3×
  `getComputedStyle` per island ≈ 99 reads × 2 UI updates per scripted move).
- Persistent SVG + `syncBoard` for roll/select updates (class markers
  `.island-hex` / `.island-hit` / chip nodes).
- Controller reuses `.remainder-board` when not entering/leaving game-over.

### juggle

- Persistent `.juggle-boards` grids; `syncJuggleBoardCells` on moves.
- `applyJuggleHoverPreview` dirty-cell toggle (hover path; no full wipe).
- Delegated grid click/hover so sync never rebinds listeners.

### harness

- Two uncounted warmup scripted moves before the measured loop in
  `PERF_MODE=render` so first-move pointer-travel outliers do not dominate
  `layoutReadsP95` when n=20 (harness percentile ≈ max).

## Non-goals / left alone

- AI search, scoring, difficulty, timing; Hex Hard 450ms; Stars & Bars history
- Player-facing copy / rules text; `*/rules.ts` legal-move paths
- hex / pent-em-in historical helpers (still absent post-restore)

## Artifact

Raw phase JSON: agent run `/opt/cursor/artifacts/q-mp-113-verify-report.json`
(phase `qmp113-verify`).
