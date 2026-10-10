# Dead-CSS Rank-1 rescan — tip post865

**Task id:** `q-mp-391` (P4 polish)  
**Tip base:** `cursor/mp-tip-post865` @ `3908809d` (`3908809d672ed70eede7b9c0ad63a6fa475e28e5`)  
**Measured at:** `2026-10-10T05:52:27Z` (UTC)  
**Deliverable:** dated residual inventory + keep/remove visual; remove only verified-unused Rank-1 CSS (none found). Report what changed vs open `#840` (`q-mp-341` post785). Contains open `#840` / `#805` / `#766`. Spec source: backlog `q-mp-391` on `#879` (written against post830; remeasured on live post865).

## Acceptance (from backlog q-mp-391; remeasured on post865)

- [x] Re-run CSS class scan equivalent to `scripts/report-dead-code.mjs` `scanCssClasses()` on live tip post865
- [x] Dated residual inventory under `docs/dev/` with keep/remove table visual
- [x] Delete only selectors with **zero** TS/HTML/script/test refs and **no** dynamic construction — **none** this pass (report-only; docs/chart only)
- [x] Dynamic families marked **kept/dynamic** (not deleted)
- [x] Script/e2e-referenced leftovers kept
- [x] Prior Rank-1 removals still absent from `src/`
- [x] Report delta vs `#840` post785 scan
- [x] No player-facing copy / rules / AI / ratchet JSON / CSS product edits

## Duplicate check (open tip drafts)

| PR                                                            | Title                              | Overlap                                                                                      |
| ------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| [#840](https://github.com/fuzzywigg/math-pentathlon/pull/840) | q-mp-341 Rank-1 dead CSS (post785) | **CONTAINED** — same scan method + identical live metrics; this PR is the post865 re-measure |
| [#805](https://github.com/fuzzywigg/math-pentathlon/pull/805) | q-mp-305 Rank-1 dead CSS (post755) | **CONTAINED** — older tip; metrics identical                                                 |
| [#766](https://github.com/fuzzywigg/math-pentathlon/pull/766) | q-mp-241 Rank-1 dead CSS (post748) | **CONTAINED** — tip already has removals + older inventory                                   |
| [#736](https://github.com/fuzzywigg/math-pentathlon/pull/736) | q-mp-211 `.move-history-panel`     | Contained / already absent on tip                                                            |
| [#710](https://github.com/fuzzywigg/math-pentathlon/pull/710) | q-mp-176 `.game-card-division`     | Contained / already absent on tip                                                            |
| [#690](https://github.com/fuzzywigg/math-pentathlon/pull/690) | q-mp-154 calla/sd CSS              | Contained / already absent on tip                                                            |
| [#877](https://github.com/fuzzywigg/math-pentathlon/pull/877) | q-mp-366 owl void brace            | Orthogonal (lint only; not on tip)                                                           |
| [#878](https://github.com/fuzzywigg/math-pentathlon/pull/878) | q-mp-371 hex UI cov r25            | Orthogonal (tests-only; not on tip)                                                          |
| [#879](https://github.com/fuzzywigg/math-pentathlon/pull/879) | q-mp-090l backlog 10c              | Spec owner only (lists q-mp-391); no CSS edits                                               |

No other open draft into `cursor/mp-tip-post865` owns a fresh Rank-1 CSS rescan (open list was empty at start).

## What changed since `#840` (post785 @ `c9b55cff`)

| Check                                                  | Result                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `git diff 97487de6..3908809d -- ':(glob)src/**/*.css'` | **empty** (no CSS source edits on tip between post785 fold `#830` and post865) |
| `git log 3908809d..HEAD -- ':(glob)src/**/*.css'`      | **empty** (measurement on clean tip HEAD)                                      |
| CSS classes defined                                    | **491 → 491** (flat)                                                           |
| Naive unused (no scripts)                              | **8 → 8** (same 8 selectors)                                                   |
| Zero-ref removable                                     | **0 → 0** (flat clean)                                                         |
| Removals applied                                       | **0 → 0** (report-only both passes)                                            |

Tip cut `#865` + folds through `#876` did **not** change Rank-1 CSS class reachability vs the post785 rescan. Spec baseline tip SHA `bcf6f825` (post830) is superseded by live post865 `3908809d`; CSS surface remains flat.

## Method

1. Walk `src/**/*.css` for class selectors (same regex as `scripts/report-dead-code.mjs`).
2. Search corpus: `src/**/*.{ts,tsx,html}`, `tests/**/*.{ts,tsx,html,mjs}`, `scripts/**/*.{mjs,js,ts}`, `index.html`.
3. Flag classes with zero whole-token hits outside defining CSS.
4. Exclude known dynamic prefixes (`difficulty-*`, `star-track-path-*`).
5. Manual `rg` proof; leave any selector with script/e2e string refs.
6. Do **not** delete when zero-ref count is 0 (this task is report-only).

## Keep / remove visual

![Rank-1 dead-CSS keep/remove snapshot](./dead-css-rank1-rescan-post865-2026-10-10.svg)

| Bucket                                                      | Count | Action            |
| ----------------------------------------------------------- | ----: | ----------------- |
| CSS classes defined                                         |   491 | —                 |
| Naive unused (TS/HTML/tests only; no scripts)               |     8 | classify          |
| Of which dynamic (`difficulty-*`, `star-track-path-*`)      |     5 | kept/dynamic      |
| Of which script-referenced (`par55-*` / `ramrod-turn-hint`) |     3 | kept              |
| Zero-ref after scripts + excluding dynamics                 | **0** | nothing to remove |
| Removed this PR                                             | **0** | report-only       |

### Before / after vs `#840` post785 rescan (`q-mp-341`)

| Metric                    | post785 (`#840`) | post865 (this PR) |      Δ |
| ------------------------- | ---------------: | ----------------: | -----: |
| CSS classes defined       |              491 |           **491** |      0 |
| Naive unused (no scripts) |                8 |             **8** |      0 |
| Zero-ref removable        |                0 |             **0** |      0 |
| Removals applied          |                0 |             **0** | report |

## Naive unused (8) — dispositions

Class names are plain text (not `` `symbol` | `path` `` rows) so `check:dev-docs` does not treat CSS selectors as TS exports.

| CSS class               | Disposition                                                                      | Defining file                   |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------- |
| difficulty-beginner     | kept/dynamic — `difficulty-${game.difficulty}` in `src/ui/game-selector.ts`      | src/style.css                   |
| difficulty-intermediate | kept/dynamic                                                                     | src/style.css                   |
| difficulty-advanced     | kept/dynamic                                                                     | src/style.css                   |
| star-track-path-p1      | kept/dynamic — `star-track-path-${p1\|p2}` in `src/games/star-track/board-ui.ts` | src/ui/styles/game-play.css     |
| star-track-path-p2      | kept/dynamic                                                                     | src/ui/styles/game-play.css     |
| par55-cell              | kept — script refs in `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs`      | src/ui/styles/forced-colors.css |
| par55-turn-hint         | kept — script ref in `scripts/par-55-deep-playtest.mjs`                          | src/games/par-55/par-55.css     |
| ramrod-turn-hint        | kept — script ref in `scripts/ramrod-deep-playtest.mjs`                          | src/games/ramrod/ramrod.css     |

### Dynamic families (do not delete)

These concrete CSS classes have no literal TS token hits but are applied via templates / `classList` construction:

- `difficulty-${game.difficulty}` → `.difficulty-beginner|intermediate|advanced`
- `star-track-path-${p1|p2}` → `.star-track-path-p1|p2`

## Verified removals (this PR)

**None.** Zero-ref re-scan after including `scripts/` and excluding dynamic prefixes is empty. Task constraint: report-only (docs/data/chart files only).

## Prior Rank-1 removals still absent

`rg` over `src tests scripts index.html` for:

- `par55-btn-primary` / `ramrod-btn-primary` (q-mp-241)
- `game-card-division` (q-mp-176)
- `calla-teaching-hint` / `sd-hands-container` (q-mp-154)
- `move-history-panel` (q-mp-211)

→ no hits (docs-only under `docs/dev/`).

## Inventory sync

- `docs/dev/dead-code-inventory.md` — changelog note pointing at this post865 rescan (no new removed rows)
- Open `#840` / `#805` / `#766` left open with disposition **contained** (do not close)

## Reproduce

```bash
# Equivalent to scanCssClasses() + scripts corpus (see method above)
node scripts/report-dead-code.mjs   # full inventory rewrite (optional; not required for this report)

rg -n 'par55-btn-primary|ramrod-btn-primary|game-card-division|calla-teaching-hint|sd-hands-container|move-history-panel' \
  src tests scripts index.html
# → empty

npm run check:dev-docs
```
