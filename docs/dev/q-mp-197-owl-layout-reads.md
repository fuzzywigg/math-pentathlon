# q-mp-197 — owl-component layout-read cut

## Goal

Reduce synchronous layout-forcing `getBoundingClientRect` reads in
`src/ui/owl/owl-component.ts` (cache rects / rAF / ResizeObserver) without
changing owl timing delays, message copy, AI, or scoring.

## Before (tip `cdd2f8b1`)

```text
$ rg 'getBoundingClientRect' src/ui/owl/owl-component.ts
6 hits — :205, :388-389, :411-413, :605
```

Runtime thrash:

| Path | Reads |
| --- | --- |
| `startCoast` reduced-motion | 2× width/height |
| `startCoast` tick | **2× per rAF frame** via `boxW()` / `boxH()` |
| `handleMouseMove` | **1× per mousemove** |

## After (this change)

```text
$ rg 'getBoundingClientRect' src/ui/owl/owl-component.ts
1 hit — sole call inside `measureContainerRect()`
(comments avoid the symbol so the verify rg counts call sites only)
```

| Path | Reads |
| --- | --- |
| `startCoast` (all modes) | **1×** at coast start (`refreshSizeCache`); **0** per tick |
| Eye tracking (docked) | ≤1× until resize/dock invalidate; coalesced to **1 rAF** |
| Eye tracking (resting) | **0** (inline `left`/`top` + size cache) |
| Size changes | `ResizeObserver` border-box (no forced layout) when available |

## What changed

- Funnel all `getBoundingClientRect` through `measureContainerRect()`.
- Cache width/height; seed/update via `ResizeObserver`; refresh once at coast start.
- Coast clamp uses frozen size for the whole coast (no per-frame layout).
- Eye tracking: rAF batch + docked center cache; resting uses authored position.

## Non-goals / left alone

- Owl speak delays, message copy (`owl-messages.ts`), AI search/scoring/timing
- Hex Hard 450ms; Stars & Bars history; `*/rules.ts` / legal-move paths
- `src/ui/three/*` board rect reads (often resize handlers)

## Verify

```bash
rg 'getBoundingClientRect' src/ui/owl/owl-component.ts
npx vitest run --project unit-shared tests/unit/*owl*
npm run test:e2e:chromium
```
