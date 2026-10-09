# burn-1008 report-only draft index

**Task id:** `q-mp-009`  
**Tip base at authoring:** `cursor/mp-tip-post477`  
**Scope:** report only — one index so the tip owner folds **this file** and the listed report drafts can be closed as **contained** (do not merge/close from this PR).

Live check (2026-10-09): no open PR already delivers `docs/dev/burn-1008-index.md`. Adjacent inventories (#545, #575 triage; compliance reviews 3–9) cover other drafts, not this consolidation.

## Index (each listed PR once)

| PR | Report | One-line verdict | PR state @ index |
| ---: | --- | --- | --- |
| [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) | [`open-draft-triage-2026-10-08.md`](./open-draft-triage-2026-10-08.md) (+ `.json`) | Classified **122** open drafts once: 80 contained / 5 superseded / 24 fold-worthy / 4 owner-decision / 9 hard-rule violation. | MERGED (on tip) |
| [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) | [`alpha-landing-preflight-2026-10-08.md`](./alpha-landing-preflight-2026-10-08.md) | **CONDITIONAL GO** tip `e1692696` → `alpha` (clean merge; gates green on confirmation; AI/rules/tutorial eyeball + soft flake/tip-drift). | MERGED (on tip) |
| [#549](https://github.com/fuzzywigg/math-pentathlon/pull/549) | [`merge-window-decision-sheet-2026-10-09.md`](./merge-window-decision-sheet-2026-10-09.md) | Consolidated Fri Oct 9 PM D0x Yes/No sheet for Andrew (recommendations mined, not decided). | MERGED (on tip) |
| [#552](https://github.com/fuzzywigg/math-pentathlon/pull/552) | [`tip-vs-alpha-audit-2026-10-08.md`](./tip-vs-alpha-audit-2026-10-08.md) (+ `.json`) | Tip-vs-`alpha` hard-rule file audit @ `36a1340d`: **1010 OK / 32 copy / 16 AI** (54 Non-OK); Hex 450 + S&B uncapped + CI perms PASS. | MERGED (on tip) |
| [#558](https://github.com/fuzzywigg/math-pentathlon/pull/558) | [`compliance-review-3-2026-10-08.md`](./compliance-review-3-2026-10-08.md) | Compliance review 3 (#544–#552): mostly **COMPLIANT / COMPLIANT-WITH-NOTES**; **#550 VIOLATION** (do not fold without drops). | OPEN (doc on tip) |
| [#561](https://github.com/fuzzywigg/math-pentathlon/pull/561) | [`compliance-review-4-2026-10-08.md`](./compliance-review-4-2026-10-08.md) | Compliance review 4 (#553–#557): all **COMPLIANT / COMPLIANT-WITH-NOTES** (#553 superseded by tip #544+#551). | OPEN (doc on tip) |
| [#564](https://github.com/fuzzywigg/math-pentathlon/pull/564) | [`compliance-review-5-2026-10-08.md`](./compliance-review-5-2026-10-08.md) | Compliance review 5 OWNER OPTION (#559/#560): both **COMPLIANT-WITH-NOTES**. | OPEN (doc on tip) |
| [#569](https://github.com/fuzzywigg/math-pentathlon/pull/569) | `docs/dev/friday-landing-preflight-v2.md (absent on tip)` (PR head; not yet on this tip) | **CONDITIONAL GO** tip `7466528b` → `alpha` Fri Oct 9 PM minus held items (ff `0/444`; unit green; e2e 281/1 SwiftShader race). | OPEN |
| [#570](https://github.com/fuzzywigg/math-pentathlon/pull/570) | [`friday-ai-copy-audit.md`](./friday-ai-copy-audit.md) | **HOLD** — tip `7466528b` not clean under owner AI/copy hard rule until §A/§B restore (or explicit keep approvals). | OPEN (doc on tip) |
| [#572](https://github.com/fuzzywigg/math-pentathlon/pull/572) | [`burn-1008-compliance-review-6.md`](./burn-1008-compliance-review-6.md) | Compliance review 6 (#562–#568): all **COMPLIANT / COMPLIANT-WITH-NOTES**; **VIOLATION: 0**. | OPEN (doc on tip) |
| [#575](https://github.com/fuzzywigg/math-pentathlon/pull/575) | [`open-draft-triage-v2.md`](./open-draft-triage-v2.md) | Triage v2 for Oct 14 bulk-close: **129** open PRs → 92 FOLDED / 7 SUPERSEDED / 11 VIOLATION / 13 RESIDUAL / 6 OWNER-OPTION. | MERGED (on tip) |
| [#580](https://github.com/fuzzywigg/math-pentathlon/pull/580) | `docs/dev/compliance-review-7.md (absent on tip)` (PR head; not yet on this tip) | Compliance review 7 (#571/#573/#574/#575): **#574 VIOLATION** (drop calla `getPhaseMessage` it); others **COMPLIANT-WITH-NOTES**. | OPEN |
| [#583](https://github.com/fuzzywigg/math-pentathlon/pull/583) | `docs/dev/compliance-review-8.md (absent on tip)` (PR head; not yet on this tip) | Compliance review 8 (#576–#579): **#578 VIOLATION** (inherited calla pin + kings phase-message copy); #579 **COMPLIANT**; others **COMPLIANT-WITH-NOTES**. | OPEN |
| [#585](https://github.com/fuzzywigg/math-pentathlon/pull/585) | `docs/dev/fold-rehearsal-v3.md (absent on tip)` (PR head; not yet on this tip) | Fold rehearsal v3 (#573→#571→#577→#574→#575→#576→#578→#579 + CR7 drops): final scratch tip lint/tsc/unit green; no AI/copy `src/` touches. | OPEN |
| [#588](https://github.com/fuzzywigg/math-pentathlon/pull/588) (review 9) | `docs/dev/compliance-review-9-2026-10-08.md` (PR head; not yet on this tip) | Compliance review 9 (#581/#582/#584/#585): **COMPLIANT-WITH-NOTES** / **COMPLIANT**; #585 drop list confirmed on tip. | OPEN |

## Tip-owner close guidance

After this index is folded into the tip:

1. Treat MERGED rows as already contained (no further fold needed for their report files).
2. For OPEN rows whose report file is already on tip (#558, #561, #564, #570, #572): comment **contained** (point here) — tip owner / closer may close; this worker does not close PRs.
3. For OPEN rows whose report file is still only on the PR head (#569, #580, #583, #585, #588): fold the report file if still wanted, **or** close as **contained** once this index’s one-line verdict is enough for the merge window.
4. Do **not** fold product hunks from any reviewed draft solely because this index links the review — follow each review’s drop/VIOLATION notes.

## Method

1. `gh pr list --repo fuzzywigg/math-pentathlon --state open` — confirmed no existing `burn-1008-index` draft.
2. Opened each listed PR body + tip `docs/dev/*` twin (when present) for the one-line verdict.
3. Review 9 = [#588](https://github.com/fuzzywigg/math-pentathlon/pull/588) (`q-mp-004`).
