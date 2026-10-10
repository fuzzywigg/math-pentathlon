# Dead-CSS Rank-1 rescan — tip post785

**Task id:** `q-mp-341` (P4 polish)  
**Tip base:** `cursor/mp-tip-post785` @ `c9b55cff` (`c9b55cff8c3832ff502179fe66f14ecaa400e95d`)  
**Measured at:** `2026-10-10T01:50:06Z` (UTC)  
**Deliverable:** dated residual inventory + keep/remove visual; remove only verified-unused Rank-1 CSS (none found). Report what changed vs open `#805` (`q-mp-305` post755). Contains open `#805` / `#766`.

## Acceptance (from backlog q-mp-341)

- [x] Re-run CSS class scan equivalent to `scripts/report-dead-code.mjs` `scanCssClasses()` on live tip post785
- [x] Dated residual inventory under `docs/dev/` with keep/remove table visual
- [x] Delete only selectors with **zero** TS/HTML/script/test refs and **no** dynamic construction — **none** this pass (report-only; docs/chart only)
- [x] Dynamic families marked **kept/dynamic** (not deleted)
- [x] Script/e2e-referenced leftovers kept
- [x] Prior Rank-1 removals still absent from `src/`
- [x] Report delta vs `#805` post755 scan
- [x] No player-facing copy / rules / AI / ratchet JSON / CSS product edits

## Duplicate check (open tip drafts)

| PR                                                            | Title                              | Overlap                                                                                      |
| ------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| [#805](https://github.com/fuzzywigg/math-pentathlon/pull/805) | q-mp-305 Rank-1 dead CSS (post755) | **CONTAINED** — same scan method + identical live metrics; this PR is the post785 re-measure |
| [#766](https://github.com/fuzzywigg/math-pentathlon/pull/766) | q-mp-241 Rank-1 dead CSS (post748) | **CONTAINED** — tip already has removals + older inventory                                   |
| [#736](https://github.com/fuzzywigg/math-pentathlon/pull/736) | q-mp-211 `.move-history-panel`     | Contained / already absent on tip                                                            |
| [#710](https://github.com/fuzzywigg/math-pentathlon/pull/710) | q-mp-176 `.game-card-division`     | Contained / already absent on tip                                                            |
| [#690](https://github.com/fuzzywigg/math-pentathlon/pull/690) | q-mp-154 calla/sd CSS              | Contained / already absent on tip                                                            |
| [#813](https://github.com/fuzzywigg/math-pentathlon/pull/813) | q-mp-295 owl UI cov r16            | Orthogonal (tests-only)                                                                      |
| [#822](https://github.com/fuzzywigg/math-pentathlon/pull/822) | q-mp-292 no-shadow controllers     | Orthogonal (lint rename)                                                                     |
| [#831](https://github.com/fuzzywigg/math-pentathlon/pull/831) | q-mp-090j backlog 10a              | Spec owner only (lists q-mp-341); no CSS edits                                               |

No other open draft into `cursor/mp-tip-post785` owns a fresh Rank-1 CSS rescan.

## What changed since `#805` (post755 @ `89e40ad7`)

| Check                                                  | Result                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| `git diff 89e40ad7..c9b55cff -- ':(glob)src/**/*.css'` | **empty** (no CSS source edits on tip since post755 scan SHA) |
| `git log 21719062..c9b55cff -- ':(glob)src/**/*.css'`  | **empty** (no CSS commits after tip cut `#785`)               |
| CSS classes defined                                    | **491 → 491** (flat)                                          |
| Naive unused (no scripts)                              | **8 → 8** (same 8 selectors)                                  |
| Zero-ref removable                                     | **0 → 0** (flat clean)                                        |
| Removals applied                                       | **0 → 0** (report-only both passes)                           |

Tip cut + folds after `#805` (owl UI cov, no-shadow controllers, void game-shell, etc.) did **not** change Rank-1 CSS class reachability.

## Method

1. Walk `src/**/*.css` for class selectors (same regex as `scripts/report-dead-code.mjs`).
2. Search corpus: `src/**/*.{ts,tsx,html}`, `tests/**/*.{ts,tsx,html,mjs}`, `scripts/**/*.{mjs,js,ts}`, `index.html`.
3. Flag classes with zero whole-token hits outside defining CSS.
4. Exclude known dynamic prefixes (`difficulty-*`, `star-track-path-*`).
5. Manual `rg` proof; leave any selector with script/e2e string refs.
6. Do **not** delete when zero-ref count is 0 (this task is report-only).

## Keep / remove visual

![Rank-1 dead-CSS keep/remove snapshot](./dead-css-rank1-rescan-post785-2026-10-10.svg)

| Bucket                                                      | Count | Action            |
| ----------------------------------------------------------- | ----: | ----------------- |
| CSS classes defined                                         |   491 | —                 |
| Naive unused (TS/HTML/tests only; no scripts)               |     8 | classify          |
| Of which dynamic (`difficulty-*`, `star-track-path-*`)      |     5 | kept/dynamic      |
| Of which script-referenced (`par55-*` / `ramrod-turn-hint`) |     3 | kept              |
| Zero-ref after scripts + excluding dynamics                 | **0** | nothing to remove |
| Removed this PR                                             | **0** | report-only       |

### Before / after vs `#805` post755 rescan (`q-mp-305`)

| Metric                    | post755 (`#805`) | post785 (this PR) |      Δ |
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

- `docs/dev/dead-code-inventory.md` — changelog note pointing at this post785 rescan (no new removed rows)
- Open `#805` / `#766` left open with disposition **contained** (do not close)

## Reproduce

```bash
# Equivalent to scanCssClasses() + scripts corpus (see method above)
node scripts/report-dead-code.mjs   # full inventory rewrite (optional; not required for this report)

rg -n 'par55-btn-primary|ramrod-btn-primary|game-card-division|calla-teaching-hint|sd-hands-container|move-history-panel' \
  src tests scripts index.html
# → empty

npm run check:dev-docs
```
