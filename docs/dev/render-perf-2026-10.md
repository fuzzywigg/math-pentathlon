# Render / input latency — 2026-10

Task: `burn-1007-mp-render-perf`

## Method

- Harness: `npm run perf:runtime` with `PERF_MODE=render` (`scripts/runtime-perf.mjs` + `scripts/render-perf-mode.mjs`).
- Viewport: tablet **768×1024** (touch).
- CPU throttle: **4×** via CDP `Emulation.setCPUThrottlingRate`.
- Per game: human-vs-human, up to **20** scripted moves; double-`rAF` after each click for paint cost.
- Metrics: time-to-interactive (nav → board ready), per-move paint ms, hover preview ms (juggle / pent-em-in), `longtask` >50ms, layout-forcing DOM reads during instrumented windows.
- Playwright tracing started per game (snapshots on; discarded after metrics).
- Scope: RENDER/INPUT only — AI search/scoring/timing untouched. Not a redo of #489 / #463 / #501.
- Twin: [`render-perf-2026-10.json`](./render-perf-2026-10.json)

## Per-game table (after)

| Game               | 3D  | TTI (ms) | Moves | Move p50/p95 (ms) | Hover p50/p95 (ms) | LT >50 | Max LT (ms) | Layout reads p95 |
| ------------------ | --- | -------: | ----: | ----------------: | -----------------: | -----: | ----------: | ---------------: |
| kings-quadraphages | yes |    833.4 |  2/20 |         61.1/72.7 |                —/— |      2 |       123.0 |               10 |
| hex                | no  |    453.7 | 20/20 |       104.4/131.1 |                —/— |      0 |         0.0 |                1 |
| star-track         | yes |    796.0 |  7/20 |        70.3/400.1 |                —/— |      1 |       123.0 |               30 |
| hex-a-gone         | yes |    752.9 |  5/20 |       120.9/134.1 |                —/— |      1 |       104.0 |               18 |
| calla              | no  |    408.7 | 20/20 |        98.3/117.3 |                —/— |      0 |         0.0 |                1 |
| sum-dominoes       | no  |    419.6 | 14/20 |        82.9/237.4 |                —/— |      0 |         0.0 |                3 |
| par-55             | no  |    402.5 | 11/20 |        67.7/154.9 |                —/— |      0 |         0.0 |               41 |
| ramrod             | no  |    406.0 | 20/20 |       118.3/168.1 |                —/— |      0 |         0.0 |                1 |
| kwatro-sinko       | yes |    868.0 | 20/20 |       155.6/172.3 |                —/— |      2 |       166.0 |               22 |
| fiar               | yes |    787.6 | 20/20 |        88.4/113.7 |                —/— |      2 |       118.0 |               14 |
| juggle             | no  |    446.1 | 20/20 |       101.4/349.7 |          42.2/43.4 |      0 |         0.0 |               92 |
| contig-60          | no  |    406.7 | 20/20 |       114.5/159.0 |                —/— |      0 |         0.0 |                2 |
| stars-bars         | no  |    449.8 | 10/20 |        60.9/148.5 |                —/— |      0 |         0.0 |                2 |
| fab-a-diffy        | no  |    533.3 |  3/20 |        86.3/110.1 |                —/— |      0 |         0.0 |                0 |
| queens-guards      | yes |    865.7 |  3/20 |         84.8/92.3 |                —/— |      2 |       175.0 |               15 |
| prime-gold         | yes |    863.1 |  3/20 |         72.4/87.7 |                —/— |      2 |       180.0 |               12 |
| remainder-islands  | no  |    408.7 | 20/20 |       134.5/168.7 |                —/— |      0 |         0.0 |              199 |
| pent-em-in         | yes |    814.5 |  3/20 |         71.0/77.7 |          41.6/47.4 |      0 |         0.0 |               10 |
| frac-fact          | no  |    403.8 | 11/20 |        60.9/226.4 |                —/— |      0 |         0.0 |                2 |
| fraction-pinball   | no  |    401.0 | 11/20 |        61.3/240.5 |                —/— |      0 |         0.0 |                2 |

Moves &lt; 20 usually means the scripted UI path stalled on multi-step chrome or the game ended early. Hover samples run after driving juggle/pent into a placing phase (pent hover uses 2D SVG even when the main session used `?board3d=1`).

## Before / after (fixed games)

Clear non-AI hotspots only. No visible UI change intended; AI timing/search/scoring untouched.

### hex (primary win)

| Metric        | Before | After |                Δ |
| ------------- | -----: | ----: | ---------------: |
| Move p50 (ms) |  103.7 | 104.4 |             +0.7 |
| Move p95 (ms) |  169.9 | 131.1 | **−38.8 (−23%)** |
| LT >50        |      0 |     0 |                0 |

Pre-restore tip used `ensureHexBoard` once and `syncHexCell` for in-place class/aria updates with delegated clicks. **Post-restore (q-mp-032):** those helpers are absent from tip `hex/board-ui` after the Friday AI/copy restore — metrics above are historical; do not reintroduce the symbols when folding open drafts.

### contig-60 (primary win)

| Metric        | Before | After |                Δ |
| ------------- | -----: | ----: | ---------------: |
| Move p50 (ms) |  149.4 | 114.5 | **−34.9 (−23%)** |
| Move p95 (ms) |  169.4 | 159.0 |  **−10.4 (−6%)** |
| LT >50        |      0 |     0 |                0 |

Persistent `.contig-board` + `syncContigBoard` (no full grid wipe per move). (`syncContigBoard` remains on tip.)

### juggle (hover path)

| Metric         | Before | After |    Δ |
| -------------- | -----: | ----: | ---: |
| Hover p95 (ms) |   47.0 |  43.4 | −3.6 |

Pre-restore tip used `applyJuggleHoverPreview` to toggle dirty preview cells only (no full UI wipe on hover). **Post-restore (q-mp-032):** export removed with alpha juggle `board-ui`; tip has no hover helper — hover path is full `renderBoard` again. Move p95 stays chrome-dominated (roll / shape selector) and is noisy across scripted mixes.

### pent-em-in (hover path)

| Metric         | Before | After |    Δ |
| -------------- | -----: | ----: | ---: |
| Hover p95 (ms) |   49.0 |  47.4 | −1.6 |

Pre-restore tip used `patchPentPreview` to replace only `g.preview` on hover in 2D SVG. **Post-restore (q-mp-032):** export removed with alpha pent-em-in `board-ui` — do not reintroduce when folding.

## Fixes shipped

1. **hex** — (historical) `ensureHexBoard` + `syncHexCell` + delegated activate — **removed by AI/copy restore**; keep alpha `board-ui`
2. **contig-60** — persistent board + `syncContigBoard` + delegated activate (**still on tip**)
3. **juggle** — (historical) hover dirty-cell preview toggle via `applyJuggleHoverPreview` — **removed by AI/copy restore**
4. **pent-em-in** — (historical) `patchPentPreview` hover-only SVG updates — **removed by AI/copy restore**
5. **Harness** — `PERF_MODE=render` tablet/CPU4× TTI + per-move + hover + longtask + layout-read probe → `docs/dev/render-perf-2026-10.md`

## Left alone

- Menu first-load trim (#489), runtime leak harness report (#463), leak cleanup (#501)
- AI search/scoring/difficulty/move delays; Hex Hard 450ms assert; Stars & Bars history
- Visual baselines / gallery PNGs; bundle gzip budgets (not bumped); CI job names / `permissions`
- Kings already incremental from prior work — no further change in this PR

## Size note

`npm run size:check` still exits 0 (report-only). Budgets file unchanged. Touched game chunks grew vs tip (hex ~+0.4 kB gzip, contig ~+0.4, juggle ~+0.6, pent ~+0.15) in exchange for the paint-path work above. Menu critical path unchanged (~21 kB).

## How to re-run

```bash
PERF_MODE=render PERF_PHASE=before npm run perf:runtime
PERF_MODE=render PERF_PHASE=after npm run perf:runtime
# optional: PERF_GAMES=hex,contig-60,juggle PERF_MOVES=20
```

Generated: 2026-10-08 (phase=after; curated for acceptance)

## Twin measurements (#511)

Additional before/after JSON from superseded twin `#511` are retained as `render-perf-2026-10-before.json` / `render-perf-2026-10-after.json` and harness `scripts/render-perf.mjs` for comparison. Tip fold prefers `#513` hotspot patches + `PERF_MODE=render` report.
