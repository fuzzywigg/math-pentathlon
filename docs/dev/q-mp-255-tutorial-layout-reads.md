# q-mp-255 — tutorial.ts layout-read cut

## Goal

Reduce layout-forcing DOM reads in `src/core/tutorial.ts`
(`getBoundingClientRect`, `offsetWidth` / `offsetHeight`) via cached rects and
read/write batching, without changing tutorial step copy, order, or
player-facing strings.

## Before (tip `cursor/mp-tip-post748`)

```text
$ rg -n 'getBoundingClientRect|offsetWidth|offsetHeight' src/core/tutorial.ts
517:        const rect = targetEl.getBoundingClientRect();
839:    const width = Math.min(tooltip.offsetWidth || maxWidth, maxWidth);
840:    const height = tooltip.offsetHeight;
```

Hot-path thrash in `showCurrentStep` (highlight steps):

| Phase | Work |
| --- | --- |
| Content DOM writes | dirty layout |
| `getBoundingClientRect(target)` | **reflow #1** |
| Highlight / cutout style writes | dirty layout |
| Tooltip park style writes | dirty layout |
| `offsetWidth` + `offsetHeight` | **reflow #2** |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|offsetWidth|offsetHeight' src/core/tutorial.ts
# getBoundingClientRect — sole call inside measureElementRect()
# offsetWidth / offsetHeight — sole calls inside measureParkedTooltipSize()
```

| Phase | Work |
| --- | --- |
| Content DOM writes | dirty layout |
| Tooltip park style writes | dirty layout (no read yet) |
| Target rect + tooltip size read batch | **reflow #1** (single) |
| Highlight + tooltip position writes | paint |

Forced reflows on the highlight hot path: **2 → 1**.

## What changed

- Funnel highlight-target geometry through `measureElementRect()`.
- Split tooltip prep into `parkTooltipForAbsolutePosition()` (writes) +
  `measureParkedTooltipSize()` (reads); pass the measured `TooltipBox` into
  `positionTooltip` / `positionTooltipCenter` so placement does not re-read.
- Cache tooltip border-box; seed/update via `ResizeObserver` when available;
  invalidate on step content rewrite.
- Keep sync `offsetWidth` / `offsetHeight` for the first measure after content
  change (jsdom tests mock those getters; visual placement stays synchronous).

## Non-goals / left alone

- Tutorial step titles, messages, order, required actions
- AI search/scoring/difficulty/timing; Hex Hard 450ms; Stars & Bars history
- `*/rules.ts` / legal-move paths; owl / par-55 / three board rect readers

## Verify

```bash
rg -n 'getBoundingClientRect|offsetWidth|offsetHeight' src/core/tutorial.ts
npx vitest run --project unit-shared tests/unit/tutorial.test.ts tests/unit/burn-wave34-tutorial-*.test.ts tests/unit/burn-wave40-tutorial-*.test.ts
npm run lint
npm run typecheck
npm run verify
npm run lint:ratchet
```
