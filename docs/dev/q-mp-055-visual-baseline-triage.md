# q-mp-055: Visual-baseline triage after AI/copy restore (report-only)

**Task id:** `q-mp-055`  
**Audience:** Andrew (baseline owner) + tip owner.  
**Report only.** One docs deliverable. **Do not** run `npm run test:e2e:visual:update` / `--update-snapshots` until Andrew decides.

| Field | Value |
| --- | --- |
| Tip / tree audited | `cursor/mp-tip-post477` @ `91a6be7e` (reanchor on land SHA `5d1433e1`) |
| Alpha | `5d1433e1` — Tip fold wave5 / #477 squash land (same product tree as tip for these baselines) |
| Restore commit (pre-land tip history) | `5aa092d4` / `0cdab37f` family — *restore alpha AI/copy surfaces per owner decision* |
| Baselines path | `tests/e2e/visual-baselines/{visual-desktop,visual-phone}/visual-baseline.spec.ts/*.png` |
| Suite | `npm run test:e2e:visual` (projects `visual-desktop` + `visual-phone`) |
| Snapshot update | **Not run** (Andrew decides) |

## Why every screen diffs on alpha

Committed PNGs entered alpha via the #477 squash, but they were captured on tip **before** the Friday AI/copy restore rewrote board-ui / status controllers / tutorials back toward alpha. Post-land `alpha` / tip run the **restored** UI against **pre-restore** baselines → report-only job `visual-baseline` is red on all 42 shots (continue-on-error).

Local Cloud Agent run and CI on alpha land agree (ratios within ~0.01 / a few dozen pixels).

## Artifact links

| Source | Link |
| --- | --- |
| Alpha CI run (#477 land) | https://github.com/fuzzywigg/math-pentathlon/actions/runs/37878397547 |
| CI artifact `visual-baseline-report` | Artifact id `11593217389` on that run (Playwright HTML + `test-results/*-{actual,expected,diff}.png`) |
| Local suite log | `/opt/cursor/artifacts/q-mp-055-visual-e2e.log` |
| Local per-screen PNGs | `/opt/cursor/artifacts/q-mp-055-visual-diffs/{desktop,phone}/<screen>/` (`*-actual.png`, `*-expected.png`, `*-diff.png`) |
| Ratio TSV | `/opt/cursor/artifacts/q-mp-055-ratio-table.tsv` |

Open a screen folder, compare `*-expected.png` (committed baseline) vs `*-actual.png` (current alpha/tip paint). Diff PNGs are Playwright red overlays.

## Classification legend

| Class | Meaning |
| --- | --- |
| **EXPECTED (restore)** | Diff tracks AI/copy restore surfaces (`board-ui`, status/`game-controller` chrome, opening deal timing from restored controllers). Safe baseline refresh candidate after eyeball. |
| **REGRESSION (suspect)** | Looks broken, clipped, or structurally wrong; **or** not explained by restore file set. Do **not** silent-update; Andrew decides fix vs new baseline. |
| **SHELL / AA** | Shared shell chrome (e.g. How to Play button green→teal) and/or antialias; restore did not touch that game’s `board-ui`. Low-content refresh. |
| **NOT AI/copy** | Outside restore path (landing hero CTA, etc.). Separate tip-land baseline drift. |

Restore surfaces (from `5aa092d4` family): `board-ui` on calla, fraction-pinball, hex, juggle, kings-quadraphages, pent-em-in, star-track, stars-bars; many `game-controller` + all `tutorial.ts`; selected `ai.ts` (Queens/Kings/Contig restored; Hex/Kwatro AI **KEEP**). Visual openings use **human-vs-human**, so You/AI seat copy often does **not** appear — board/status/deal paint still moves.

## Per-screen table (desktop + phone)

Pixel ratios from local `npm run test:e2e:visual` (stable capture). CI alpha land ratios match within noise.

| Screen | Desktop px (ratio) | Phone px (ratio) | Restore surface | Class | Notes + artifacts |
| --- | ---: | ---: | --- | --- | --- |
| start screen | 37700 (0.05) | 53747 (0.21) | none | **NOT AI/copy** | “Your Progress” expected as underlined link under stats; actual is `hero-progress-link` button (`src/style.css` / `game-selector.ts`). Tip shell CTA, not restore. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/start-screen/) · [phone](/opt/cursor/artifacts/q-mp-055-visual-diffs/phone/start-screen/) |
| calla | 29515 (0.04) | 59518 (0.23) | board-ui + controller + rules | **EXPECTED (restore)** | Status/board chrome restored to alpha. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/calla-opening/) |
| contig-60 | 34252 (0.04) | 49005 (0.19) | controller (+ AI restore) | **EXPECTED (restore)** | Opening chrome/status from restored controller. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/contig-60-opening/) |
| fab-a-diffy | 20653 (0.03) | 39140 (0.16) | controller (status/delays; tip a11y keeper) | **EXPECTED (restore)** | Mostly status/shell; forced-colors scroll helper kept. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/fab-a-diffy-opening/) |
| fiar | 37703 (0.05) | 44913 (0.18) | tutorial only | **SHELL / AA** | Tutorial not on HvH opening; shared How to Play palette + AA. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/fiar-opening/) |
| frac-fact | 9686 (0.02) | 32994 (0.13) | tutorial only | **SHELL / AA** | Smallest desktop delta; chrome/AA. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/frac-fact-opening/) |
| fraction-pinball | 17482 (0.02) | 60788 (0.24) | board-ui + controller | **EXPECTED (restore)** | Board-ui restore; phone amplifies layout. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/fraction-pinball-opening/) |
| hex | 28668 (0.04) | 44026 (0.18) | board-ui + controller | **REGRESSION (suspect)** + restore | Restore switched SVG to `width/height: 100%` and alpha edge/label paint. **Actual clips** the board (labels ~B–K / 4–9 vs expected full A–K / 1–11). Eyeball before baseline update — may need layout fix, not only PNG refresh. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/hex-opening/) |
| hex-a-gone | 13137 (0.02) | 35845 (0.14) | controller | **EXPECTED (restore)** | Think-delay/status restore; low desktop ratio. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/hex-a-gone-opening/) |
| juggle | 12682 (0.02) | 46917 (0.19) | board-ui + controller | **EXPECTED (restore)** | Large board-ui deletion (incl. hover preview). Opening grids look aligned; residual = chrome/AA. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/juggle-opening/) |
| kings-quadraphages | 33179 (0.04) | 75378 (0.30) | board-ui + controller (+ AI) | **EXPECTED (restore)** | Board/status restore; phone 0.30. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/kings-quadraphages-opening/) |
| kwatro-sinko | 24225 (0.03) | 81389 (0.32) | tutorial only (AI **KEEP**) | **SHELL / AA** + phone suspect | Desktop mostly shell; phone 0.32 — reflow worth a look before refresh. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/kwatro-sinko-opening/) · [phone](/opt/cursor/artifacts/q-mp-055-visual-diffs/phone/kwatro-sinko-opening/) |
| par-55 | 32892 (0.04) | 58798 (0.23) | controller | **EXPECTED (restore)** | [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/par-55-opening/) |
| pent-em-in | 17803 (0.02) | 51812 (0.21) | board-ui + controller | **EXPECTED (restore)** | [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/pent-em-in-opening/) |
| prime-gold | 23412 (0.03) | 70139 (0.28) | tutorial only | **SHELL / AA** + phone suspect | [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/prime-gold-opening/) · [phone](/opt/cursor/artifacts/q-mp-055-visual-diffs/phone/prime-gold-opening/) |
| queens-guards | 23292 (0.03) | 36870 (0.15) | controller (+ AI restore to alpha 2500) | **EXPECTED (restore)** | HvH opening; paint delays/status. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/queens-guards-opening/) |
| ramrod | 36335 (0.04) | 99821 (0.39) | controller | **REGRESSION (suspect)** on phone | Desktop expected-restore; **phone 0.39 highest** — layout/clip risk. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/ramrod-opening/) · [phone](/opt/cursor/artifacts/q-mp-055-visual-diffs/phone/ramrod-opening/) |
| remainder-islands | 19418 (0.03) | 45404 (0.18) | tutorial only | **SHELL / AA** | [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/remainder-islands-opening/) |
| star-track | 16580 (0.02) | 51631 (0.20) | board-ui + controller | **EXPECTED (restore)** | [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/star-track-opening/) |
| stars-bars | 15118 (0.02) | 47671 (0.19) | board-ui + controller | **EXPECTED (restore)** | History remains uncapped (compliant). [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/stars-bars-opening/) |
| sum-dominoes | 80048 (0.09) | 71378 (0.28) | controller + tutorial (no board-ui in restore) | **REGRESSION (suspect)** | Highest desktop ratio. Expected: double-half domino hands + center double-two. Actual: single-face tile inventory + center double-four — structural opening-state / paint change **without** board-ui restore. Investigate RNG consumption / hand render before baseline update. [desktop](/opt/cursor/artifacts/q-mp-055-visual-diffs/desktop/sum-dominoes-opening/) |

## Cross-cutting observations

1. **Shared shell:** Almost every game opening shows How to Play (and sometimes Tutorial) green→darker teal vs baseline. Not from per-game restore hunks; treat as shell/AA when classifying tutorial-only games.
2. **Phone amplifies:** Phone ratios ~4–10× desktop for the same screen. Prefer desktop for “is this restore?”; use phone for “is layout broken?”.
3. **You/AI copy:** HvH openings keep “Blue/Red” status — restore of You/Computer strings is mostly invisible in this suite.
4. **CI posture unchanged:** Job stays report-only (`continue-on-error`). Do not promote to required until Andrew refreshes baselines or clears regressions.

## Recommended next actions (Andrew / tip owner)

1. Eyeball **REGRESSION (suspect)** first: hex clip, sum-dominoes hand/deal, ramrod phone, high phone kwatro/prime-gold.
2. For **EXPECTED (restore)** desktop screens that look intentional alpha paint → `npm run test:e2e:visual:update` on Linux (CI-matched) in a dedicated tip fold — **not** this PR.
3. Refresh **start screen** baseline only if the Progress button CTA is accepted tip UI (separate from AI/copy).
4. Leave tutorial-only **SHELL / AA** screens for the same update wave once shell palette is settled.

## Overlap check (open drafts)

No open draft already delivers this expected-vs-regression table. Related but different:

- #467 / #445 — introduce baselines/suite (folded).
- #570 — Friday AI/copy hunk audit (text/AI surfaces, not visual PNGs).
- #591 — post-restore orphan symbols.

## Verification (commands)

```bash
npm run test:e2e:visual
# exit 1 — 42 failed (21 desktop + 21 phone screenshot mismatches)
# no --update-snapshots
```

See PR body Verification log for exact exit codes and key output lines.
