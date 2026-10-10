# Dead-CSS Rank-1 rescan — tip post755

**Task id:** `q-mp-305` (P4 polish)  
**Tip base:** `cursor/mp-tip-post755` @ `89e40ad7` (`89e40ad7e0c3d058725cebd3b871425148ead60b`)  
**Measured at:** `2026-10-09T22:52:07Z` (UTC)  
**Deliverable:** dated residual inventory + keep/remove visual; remove only verified-unused Rank-1 CSS (none found). Contains open `#766` (`q-mp-241` post748 rescan).

## Acceptance (from backlog q-mp-305)

- [x] Re-run CSS class scan equivalent to `scripts/report-dead-code.mjs` `scanCssClasses()` on live tip post755
- [x] Dated residual inventory under `docs/dev/` with keep/remove table visual
- [x] Delete only selectors with **zero** TS/HTML/script/test refs and **no** dynamic construction — **none** this pass (report-only)
- [x] Dynamic families marked **kept/dynamic** (not deleted)
- [x] Script/e2e-referenced leftovers kept
- [x] Prior Rank-1 removals still absent from `src/`
- [x] No player-facing copy / rules / AI / ratchet JSON edits; no intentional chrome change

## Duplicate check (open tip drafts)

| PR                                                            | Title                              | Overlap                                                                                                                      |
| ------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [#766](https://github.com/fuzzywigg/math-pentathlon/pull/766) | q-mp-241 Rank-1 dead CSS (post748) | **CONTAINED** — tip already has removals + `docs/dev/dead-css-rank1-rescan-2026-10-09.md`; this PR is the post755 re-measure |
| [#736](https://github.com/fuzzywigg/math-pentathlon/pull/736) | q-mp-211 `.move-history-panel`     | Contained / already absent on tip                                                                                            |
| [#710](https://github.com/fuzzywigg/math-pentathlon/pull/710) | q-mp-176 `.game-card-division`     | Contained / already absent on tip                                                                                            |
| [#690](https://github.com/fuzzywigg/math-pentathlon/pull/690) | q-mp-154 calla/sd CSS              | Contained / already absent on tip                                                                                            |
| [#801](https://github.com/fuzzywigg/math-pentathlon/pull/801) | q-mp-090h backlog 09i              | Spec owner only (lists q-mp-305); no CSS edits                                                                               |

No other open draft into `cursor/mp-tip-post755` owns a fresh Rank-1 CSS rescan.

## Method

1. Walk `src/**/*.css` for class selectors (same regex as `scripts/report-dead-code.mjs`).
2. Search corpus: `src/**/*.{ts,tsx,html}`, `tests/**/*.{ts,tsx,html,mjs}`, `scripts/**/*.{mjs,js,ts}`, `index.html`.
3. Flag classes with zero whole-token hits outside defining CSS.
4. Exclude known dynamic prefixes (`difficulty-*`, `star-track-path-*`).
5. Manual `rg` proof; leave any selector with script/e2e string refs.
6. Do **not** delete when zero-ref count is 0.

## Keep / remove visual

![Rank-1 dead-CSS keep/remove snapshot](./dead-css-rank1-rescan-post755-2026-10-09.svg)

| Bucket                                                      | Count | Action            |
| ----------------------------------------------------------- | ----: | ----------------- |
| CSS classes defined                                         |   491 | —                 |
| Naive unused (TS/HTML/tests only; no scripts)               |     8 | classify          |
| Of which dynamic (`difficulty-*`, `star-track-path-*`)      |     5 | kept/dynamic      |
| Of which script-referenced (`par55-*` / `ramrod-turn-hint`) |     3 | kept              |
| Zero-ref after scripts + excluding dynamics                 | **0** | nothing to remove |
| Removed this PR                                             | **0** | report-only       |

### Before / after vs post748 rescan (`q-mp-241`)

| Metric                    | post748 (`q-mp-241`) | post755 (this PR) |                                    Δ |
| ------------------------- | -------------------: | ----------------: | -----------------------------------: |
| CSS classes defined       |                  493 |           **491** | −2 (btn-primary already gone on tip) |
| Naive unused (no scripts) |                   10 |             **8** |                                   −2 |
| Zero-ref removable        |   2 → 0 after delete |             **0** |                           flat clean |
| Removals applied          |  2 (`*-btn-primary`) |             **0** |                          report-only |

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

(Other historical families — `occupied-*`, `owl-mood-*`, `phase-*` — no longer appear as naive-unused on this tip; either removed earlier or now have literal corpus hits.)

## Verified removals (this PR)

**None.** Zero-ref re-scan after including `scripts/` and excluding dynamic prefixes is empty.

## Prior Rank-1 removals still absent

`rg` over `src tests scripts index.html` for:

- `par55-btn-primary` / `ramrod-btn-primary` (q-mp-241)
- `game-card-division` (q-mp-176)
- `calla-teaching-hint` / `sd-hands-container` (q-mp-154)
- `move-history-panel` (q-mp-211)

→ no hits (docs-only under `docs/dev/`).

## Inventory sync

- `docs/dev/dead-code-inventory.md` — changelog note pointing at this post755 rescan (no new removed rows)
- Open `#766` left open with disposition **contained** (do not close)

## Reproduce

```bash
# Equivalent to scanCssClasses() + scripts corpus (see method above)
node scripts/report-dead-code.mjs   # full inventory rewrite (optional; not required for this report)

rg -n 'par55-btn-primary|ramrod-btn-primary|game-card-division|calla-teaching-hint|sd-hands-container|move-history-panel' \
  src tests scripts index.html
# → empty

npm run check:dev-docs
```
