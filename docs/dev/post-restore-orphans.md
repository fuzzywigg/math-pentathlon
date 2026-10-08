# Post-restore orphan symbols (q-mp-032)

**Tip:** `cursor/integration-fold-wave5-tip-4af0` @ `9748c908` (audit base)  
**Restore:** `5aa092d4` — _restore alpha AI/copy surfaces per owner decision (pre-Friday)_  
**Scope:** tests + docs only. No product `src/` edits in this task.

Friday AI/copy restore replaced tip-evolved `board-ui` / controller / rules surfaces with `origin/alpha` content. Helpers that tip (and open drafts) still _name_ are gone from tip `src/`. Tip unit tests no longer import those symbols (r4 juggle suite deleted in `358e75e8`). Remaining tip hits are docs/JSON; open drafts still carry pre-restore `src/` (and would reintroduce symbols if folded naively).

## Missing on tip `src/` (canonical orphans)

| Symbol                                                 | Pre-restore home                     | Tip status                              |
| ------------------------------------------------------ | ------------------------------------ | --------------------------------------- |
| `applyJuggleHoverPreview`                              | `juggle/board-ui.ts`                 | absent                                  |
| `patchHoverPreview`                                    | `juggle/board-ui.ts` (#511 name)     | absent                                  |
| `patchBoardPreview`                                    | `pent-em-in/board-ui.ts` (#511 name) | absent                                  |
| `patchPentPreview`                                     | `pent-em-in/board-ui.ts`             | absent                                  |
| `ensureHexBoard`                                       | `hex/board-ui.ts` (non-export)       | absent                                  |
| `syncHexCell`                                          | `hex/board-ui.ts` (non-export)       | absent                                  |
| `formatPhaseStatusMessage`                             | `star-track/board-ui.ts`             | absent                                  |
| `AI_DRAW_DELAY_MS` / `AI_SELECT_DELAY_MS`              | `star-track/game-controller.ts`      | absent (alpha `AI_THINKING_DELAY` kept) |
| `renderPlaceControls` / `PentEmInPlaceControlHandlers` | `pent-em-in/board-ui.ts`             | absent                                  |
| `CallaDisplayMode`                                     | `calla/rules.ts`                     | absent                                  |
| `PinballResultOptions` / `PinballGameMode`             | `fraction-pinball/board-ui.ts`       | absent                                  |

`syncContigBoard` remains on tip and is **not** an orphan.

---

## Tip reference list (file:line)

Inventory at tip `9748c908` before this PR’s doc fixes. **Disposition** = what q-mp-032 did.

### Tip tests

| File:line | Symbol | Disposition                                                                                                                                       |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(none)_  | —      | Tip `tests/` had **zero** imports/refs after `358e75e8` dropped `burn-1008-ui-cov-r4-juggle-board-controller.test.ts`. No `skipIf` needed on tip. |

### Tip docs / JSON (stale “still shipped” claims → fixed)

| File:line                                        | Symbol                          | Disposition                                         |
| ------------------------------------------------ | ------------------------------- | --------------------------------------------------- |
| `docs/dev/render-perf-2026-10.md:55`             | `ensureHexBoard`, `syncHexCell` | **Fixed** — marked historical / removed by restore  |
| `docs/dev/render-perf-2026-10.md:73`             | `applyJuggleHoverPreview`       | **Fixed** — marked historical / removed by restore  |
| `docs/dev/render-perf-2026-10.md:81`             | `patchPentPreview`              | **Fixed** — marked historical / removed by restore  |
| `docs/dev/render-perf-2026-10.md:85`             | `ensureHexBoard`, `syncHexCell` | **Fixed** — historical in “Fixes shipped”           |
| `docs/dev/render-perf-2026-10.md:88`             | `patchPentPreview`              | **Fixed** — historical in “Fixes shipped”           |
| `docs/dev/render-perf-2026-10.json:18`           | `patchPentPreview`              | **Fixed** — fixNotes annotated                      |
| `docs/dev/render-perf-2026-10.json:19`           | `ensureHexBoard`, `syncHexCell` | **Fixed** — fixNotes annotated                      |
| `docs/dev/render-perf-2026-10.json:1259`         | `patchPentPreview`              | **Fixed** — nested meta copy                        |
| `docs/dev/render-perf-2026-10.json:1260`         | `ensureHexBoard`, `syncHexCell` | **Fixed** — nested meta copy                        |
| `docs/dev/ui-coverage-round-5.md:72`             | `applyJuggleHoverPreview`       | **Fixed** — note updated: suite deleted, not skipIf |
| `docs/playtest/star-track-deep-2026-10-07.md:43` | `formatPhaseStatusMessage`      | **Fixed** — annotated removed by restore            |

### Tip docs (historical audit / triage — keep; correctly note absence or HELD)

| File:line                                          | Symbol                                   | Disposition                                      |
| -------------------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| `docs/dev/burn-1008-compliance-review.md:102`      | `patchHoverPreview`, `patchBoardPreview` | **Keep** — evidence that tip lacks hover patches |
| `docs/dev/burn-1008-compliance-review.md:353`      | `patchHoverPreview`                      | **Keep** — verify command expecting absence      |
| `docs/dev/open-draft-triage-2026-10-08.md:185`     | `patchHoverPreview`, `patchBoardPreview` | **Keep** — fold note for #511                    |
| `docs/dev/open-draft-triage-2026-10-08.md:257–258` | `patchHoverPreview`                      | **Keep** — grep recipe                           |
| `docs/dev/open-draft-triage-2026-10-08.json:3022`  | `patchHoverPreview`, `patchBoardPreview` | **Keep** — machine twin of triage                |
| `docs/dev/friday-ai-copy-audit.md:100`             | `AI_DRAW_DELAY_MS`, `AI_SELECT_DELAY_MS` | **Keep** — HELD delta vs alpha                   |

---

## Per-draft drop list (open tip-based drafts)

Only drafts whose **changed files vs tip** still contain orphan symbols. Fold tasks: drop these hunks; do **not** reintroduce helpers into restored alpha `board-ui` / AI timing / calla display-mode APIs.

### #511 — `cursor/burn-1007-mp-render-perf-b5ec` — perf(render) hover latency

| Drop                             | Locations on head                                                                                                                                                                                                                                                             | Reason                                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entire hover-patch product delta | `src/games/juggle/board-ui.ts` (`patchHoverPreview`), `src/games/juggle/game-controller.ts` call sites; `src/games/pent-em-in/board-ui.ts` (`patchBoardPreview`, `renderPlaceControls`, `PentEmInPlaceControlHandlers`), `src/games/pent-em-in/game-controller.ts` call sites | Reintroduces symbols removed by AI/copy restore. Tip already has #513 harness/report path; keep docs/JSON/harness only if still missing, never restored alpha board-ui. |
| Doc claims of live helpers       | `docs/dev/render-perf-2026-10.md` hover/hex helper prose                                                                                                                                                                                                                      | Tip doc now marks helpers historical (this PR).                                                                                                                         |

**Fold action:** SKIP product `src/games/{juggle,pent-em-in}/**` from #511 (or take tip). Optional: harness-only if not already on tip.

### #520 — `cursor/lint-ratchet-burn-1008-574c` — lint-rule ratchet

Pre-restore tree still in branch. When folding lint/type-only intent:

| Drop (keep tip / alpha restore)                                     | Symbols on head                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/games/juggle/board-ui.ts` + controller hover wiring            | `applyJuggleHoverPreview`                                                 |
| `src/games/pent-em-in/board-ui.ts` + controller                     | `patchPentPreview`, `renderPlaceControls`, `PentEmInPlaceControlHandlers` |
| `src/games/hex/board-ui.ts` incremental helpers                     | `ensureHexBoard`, `syncHexCell`                                           |
| `src/games/star-track/board-ui.ts` + controller delays              | `formatPhaseStatusMessage`, `AI_DRAW_DELAY_MS`, `AI_SELECT_DELAY_MS`      |
| `src/games/calla/rules.ts` display-mode API                         | `CallaDisplayMode`                                                        |
| `src/games/fraction-pinball/board-ui.ts` (+ controller type import) | `PinballResultOptions`, `PinballGameMode`                                 |

**Fold action:** Prefer tip versions of restored AI/copy surfaces; apply only lint-ratchet deltas that do not revive the table above. No test orphans on this head.

### #537 — `cursor/type-ratchet-p2-batch2-047a` — type-ratchet Batch 2

| Drop                                                   | Locations                  | Reason                                                                    |
| ------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------- |
| `CallaDisplayMode` / `getPhaseMessage` gameMode params | `src/games/calla/rules.ts` | Player-facing seat display API removed by restore; hard-ruled out of fold |

**Fold action:** Take tip `calla/rules.ts`; fold only non-AI rules files that remain eligible.

### #553 — `cursor/type-ratchet-batch5-nonrules-c6f9` — type-ratchet Batch 5

| Drop                                                                        | Locations                          | Reason          |
| --------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| `applyJuggleHoverPreview`                                                   | `src/games/juggle/board-ui.ts`     | Restore-removed |
| `ensureHexBoard` / `syncHexCell`                                            | `src/games/hex/board-ui.ts`        | Restore-removed |
| `patchPentPreview` / `renderPlaceControls` / `PentEmInPlaceControlHandlers` | `src/games/pent-em-in/board-ui.ts` | Restore-removed |

**Fold action:** Tip already advanced Batch 5/9 floors; if any residual type-only hunks remain, apply on tip’s restored files only — never revive helpers.

### #585 — `cursor/fold-rehearsal-v3-56d0` — fold rehearsal v3 (docs only)

| Note                                                              | Locations                                     | Action                                                                   |
| ----------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Documents drop of #577 juggle tests for `applyJuggleHoverPreview` | `docs/dev/fold-rehearsal-v3.md:36,63,187,238` | **No drop** — accurate fold guidance. Tip already deleted the test file. |

### #588 — `cursor/q-mp-004-compliance-review-9-8f9d` — compliance review 9

| Note                                                 | Locations                                    | Action                                    |
| ---------------------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| Mentions `applyJuggleHoverPreview` in review of #585 | `docs/dev/compliance-review-9-2026-10-08.md` | **No drop** — historical compliance text. |

### Other open tip-based drafts

Scanned tip-based open PRs (including #554–#590 cluster): **no** changed `tests/` or `src/` files still naming the orphan set, except #511 / #520 / #537 / #553 above. Docs-only mentions in compliance / triage / friday-audit stacks are historical — no fold drops required beyond “do not treat as live API.”

### Already resolved on tip

| Item                                                     | Resolution                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| #577 r4 juggle tests importing `applyJuggleHoverPreview` | Merged then deleted (`358e75e8`); tip tests green without skipIf |
| Round-5 `describe.skipIf` gate                           | Superseded by file deletion; doc updated in this PR              |

---

## Tip owner fold checklist (short)

1. Never reintroduce the canonical orphan table into restored AI/copy surfaces.
2. #511 — skip product hover patches; harness/docs only if needed.
3. #520 / #553 / #537 — rebase onto tip; discard board-ui / calla / star-track / pinball hunks that revive orphans; keep lint/type-only residue.
4. After each fold: `rg` the orphan symbol list over `src/` and `tests/` — expect zero (docs may still name them historically).

## Verification (this PR)

See PR body for exact command paste. Expected: tip unit suite green; lint / typecheck / boundaries / ratchets green; tests/docs-only diff.
