# q-mp-135 — Star Track move p95 / 3D layout

See the before/after + HOLD write-up in [`render-perf-2026-10-09.md`](./render-perf-2026-10-09.md#q-mp-135--star-track-move-p95-characterization--3d-layout-trim).

## Latest harness slice

| Phase | Landed | Move p50/p95 | Max | Layout reads p95 |
|---|---:|---:|---:|---:|
| tip-rerun (baseline) | 9/20 | 74.4 / **412.3** | 467.5 | 30 |
| qmp135-css-only | 7/20 | 78.1 / 427.8 | 456.8 | 28 |
| qmp135-css-only-b | 6/20 | 75.7 / 418.7 | 428.2 | 28 |

JSON: `docs/dev/q-mp-135-star-track-layout.json`.

**Verdict:** tip-owner **HOLD** on move p95 — dominated by harness `waitForTimeout(200)` inside `measureMoveCost`, not AI think time. Layout trim in `star-track-board-3d.ts` still applied (peer-aligned).
