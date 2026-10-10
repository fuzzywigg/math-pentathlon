# Dead-CSS Rank-1 rescan — tip post914

**Task id:** `q-mp-461` (P3 docs with real visuals)  
**Tip base:** `cursor/mp-tip-post914` @ `753052a6` (`753052a6844e80c6264d1d2480deafa5a9e7b59c`)  
**Measured at:** `2026-10-10T09:21:55Z` (UTC)  
**Deliverable:** dated residual inventory + keep/remove visual; remove only verified-unused Rank-1 CSS (none found). Report what changed vs open `#882` (`q-mp-391` post865). Contains open `#882` / `#840` / `#805` / `#766`. Spec source: backlog `q-mp-461` on tip (written against post898; remeasured on live post914).

## Acceptance (from backlog q-mp-461; remeasured on post914)

- [x] Re-run CSS class scan equivalent to `scripts/report-dead-code.mjs` `scanCssClasses()` on live tip post914
- [x] Dated residual inventory under `docs/dev/` with keep/remove table visual
- [x] Delete only selectors with **zero** TS/HTML/script/test refs and **no** dynamic construction — **none** this pass (report-only; docs/chart only — task constraint: do not delete CSS)
- [x] Dynamic families marked **kept/dynamic** (not deleted)
- [x] Script/e2e-referenced leftovers kept
- [x] Prior Rank-1 removals still absent from `src/`
- [x] Report delta vs `#882` post865 scan
- [x] No player-facing copy / rules / AI / ratchet JSON / CSS product edits

## Duplicate check (open tip drafts)

| PR                                                            | Title                              | Overlap                                                                                      |
| ------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| [#882](https://github.com/fuzzywigg/math-pentathlon/pull/882) | q-mp-391 Rank-1 dead CSS (post865) | **CONTAINED** — same scan method + identical live metrics; this PR is the post914 re-measure |
| [#840](https://github.com/fuzzywigg/math-pentathlon/pull/840) | q-mp-341 Rank-1 dead CSS (post785) | **CONTAINED** — older tip; metrics identical                                                 |
| [#805](https://github.com/fuzzywigg/math-pentathlon/pull/805) | q-mp-305 Rank-1 dead CSS (post755) | **CONTAINED** — older tip; metrics identical                                                 |
| [#766](https://github.com/fuzzywigg/math-pentathlon/pull/766) | q-mp-241 Rank-1 dead CSS (post748) | **CONTAINED** — tip already has removals + older inventory                                   |
| [#736](https://github.com/fuzzywigg/math-pentathlon/pull/736) | q-mp-211 `.move-history-panel`     | Contained / already absent on tip                                                            |
| [#710](https://github.com/fuzzywigg/math-pentathlon/pull/710) | q-mp-176 `.game-card-division`     | Contained / already absent on tip                                                            |
| [#690](https://github.com/fuzzywigg/math-pentathlon/pull/690) | q-mp-154 calla/sd CSS              | Contained / already absent on tip                                                            |
| [#935](https://github.com/fuzzywigg/math-pentathlon/pull/935) | q-mp-456 engine cov r15 (post898)  | Orthogonal (tests-only; unfolded into post898)                                               |
| [#934](https://github.com/fuzzywigg/math-pentathlon/pull/934) | q-mp-090o backlog 10f              | Spec owner only (lists q-mp-461); no CSS edits                                               |

No other open draft into `cursor/mp-tip-post914` owns a fresh Rank-1 CSS rescan (`gh pr list --base cursor/mp-tip-post914 --state open` was empty at start).

## What changed since `#882` (post865 @ `3908809d`)

| Check                                                  | Result                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `git diff 3908809d..753052a6 -- ':(glob)src/**/*.css'` | **empty** (no CSS source edits on tip between post865 fold `#865` and post914) |
| `git log 3908809d..753052a6 -- ':(glob)src/**/*.css'`  | **empty** (no CSS commits across post898 `#898` + post914 `#914` tip cuts)     |
| CSS classes defined                                    | **491 → 491** (flat)                                                           |
| Naive unused (no scripts)                              | **8 → 8** (same 8 selectors)                                                   |
| Zero-ref removable                                     | **0 → 0** (flat clean)                                                         |
| Removals applied                                       | **0 → 0** (report-only both passes)                                            |

Tip cuts `#898` + `#914` plus folds through round-15 backlog doc did **not** change Rank-1 CSS class reachability vs the post865 rescan. Spec baseline tip SHA `788b4558` (post898 mid-fold) is superseded by live post914 `753052a6`; CSS surface remains flat. UI TS touch-ups between tips (`board-a11y`, `owl-component`, `pointer-hygiene`, `reduced-motion`, `stats-dashboard`) did not introduce or retire class tokens that alter the Rank-1 unused set.

## Method

1. Walk `src/**/*.css` for class selectors (same regex as `scripts/report-dead-code.mjs`).
2. Search corpus: `src/**/*.{ts,tsx,html}`, `tests/**/*.{ts,tsx,html,mjs}`, `scripts/**/*.{mjs,js,ts}`, `index.html`.
3. Flag classes with zero whole-token hits outside defining CSS.
4. Exclude known dynamic prefixes (`difficulty-*`, `star-track-path-*`).
5. Manual `rg` proof; leave any selector with script/e2e string refs.
6. Do **not** delete when zero-ref count is 0 (this task is report-only).

## Keep / remove visual

![Rank-1 dead-CSS keep/remove snapshot](./dead-css-rank1-rescan-post914-2026-10-10.svg)

| Bucket                                                      | Count | Action            |
| ----------------------------------------------------------- | ----: | ----------------- |
| CSS classes defined                                         |   491 | —                 |
| Naive unused (TS/HTML/tests only; no scripts)               |     8 | classify          |
| Of which dynamic (`difficulty-*`, `star-track-path-*`)      |     5 | kept/dynamic      |
| Of which script-referenced (`par55-*` / `ramrod-turn-hint`) |     3 | kept              |
| Zero-ref after scripts + excluding dynamics                 | **0** | nothing to remove |
| Removed this PR                                             | **0** | report-only       |

### Before / after vs `#882` post865 rescan (`q-mp-391`)

| Metric                    | post865 (`#882`) | post914 (this PR) |      Δ |
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

**None.** Zero-ref re-scan after including `scripts/` and excluding dynamic prefixes is empty. Task constraint: report-only (docs/data/chart files only); do not delete CSS.

## Prior Rank-1 removals still absent

`rg` over `src tests scripts index.html` for:

- `par55-btn-primary` / `ramrod-btn-primary` (q-mp-241)
- `game-card-division` (q-mp-176)
- `calla-teaching-hint` / `sd-hands-container` (q-mp-154)
- `move-history-panel` (q-mp-211)

→ no hits (docs-only under `docs/dev/`).

## Inventory sync

- `docs/dev/dead-code-inventory.md` — changelog note pointing at this post914 rescan (no new removed rows)
- Open `#882` / `#840` / `#805` / `#766` left open with disposition **contained** (do not close; this worker does not comment on other PRs)

## Reproduce

```bash
# Equivalent to scanCssClasses() + scripts corpus (see method above)
node scripts/report-dead-code.mjs   # full inventory rewrite (optional; not required for this report)

rg -n 'par55-btn-primary|ramrod-btn-primary|game-card-division|calla-teaching-hint|sd-hands-container|move-history-panel' \
  src tests scripts index.html
# → empty

npm run check:dev-docs
```
