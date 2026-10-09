# q-mp-135 — Star Track move p95 / 3D layout

See the before/after + HOLD write-up in [`render-perf-2026-10-09.md`](./render-perf-2026-10-09.md#q-mp-135--star-track-move-p95-characterization--3d-layout-trim).

## Harness slices

| Phase | Landed | Move p50/p95 | Max | Layout reads p95 |
|---|---:|---:|---:|---:|
| tip-rerun (baseline) | 9/20 | 74.4 / **412.3** | 467.5 | 30 |
| qmp135-css-only | 7/20 | 78.1 / 427.8 | 456.8 | 28 |
| qmp135-css-only-b | 6/20 | 75.7 / 418.7 | 428.2 | 28 |
| qmp135-final (phase-gated fit) | 4/20 | 75.9 / 90.5* | 440.4 | 10 |

\* Low p95 with ≤5 landings is a **landing-rate flake** (too few samples carrying the harness 200ms wait). Treat stable HOLD band as **~419–428** from css-only runs; max still ~440 confirms wait path.

JSON: `docs/dev/q-mp-135-star-track-layout.json`.

**Verdict:** tip-owner **HOLD** on move p95 — dominated by harness `waitForTimeout(200)` inside `measureMoveCost`, not AI think time. Layout trim kept: phase-gated `fitHostToViewport`, outer-container ResizeObserver, skip unchanged sync. CSS-only host sizing was tried and **reverted** (broke e2e `assertChainAboveFold`).
