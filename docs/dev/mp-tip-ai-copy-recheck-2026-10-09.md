# Tip AI / copy / rules recheck — live tip vs `alpha` (M-MP-2)

**Task id:** `q-mp-029`  
**Role:** worker (report-only)  
**Audience:** tip owner (q-mp-026) + Grok Bot (M-MP-2 land)  
**Deliverable:** this doc only. No product code, no other-PR comments/labels/edits/closes/folds/merges.

| Field | Value |
| --- | --- |
| Tip SHA tested | `c5927c1392fcb707f63d6c5890ddc294e50b511e` (`c5927c13`) |
| Tip branch | `cursor/mp-tip-post477` |
| Tip PR | [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) (draft; base=`alpha`) |
| Alpha at test | `5d1433e1ea8081acd309bede4261c90d8c5c52aa` (`5d1433e1`) |
| Divergence | `0` behind / **16** ahead of `alpha` (fast-forward stack; merge-base == alpha) |
| Prior GO | [`landing-preflight-v4-mp-tip-post477.md`](landing-preflight-v4-mp-tip-post477.md) via [#627](https://github.com/fuzzywigg/math-pentathlon/pull/627) (`q-mp-010`) at tip `6dc4afa0` |
| Tip drift since GO | **1** commit: `c5927c13` docs(dev) burn-1008 index (`q-mp-009`) — **no** `src/` / product changes |

---

## Verdict

### **EMPTY** — no AI / copy / rules blockers for M-MP-2 tip→alpha at tip `c5927c13`

Live tip head vs `origin/alpha` has **no** AI-behavior, player-facing copy, or `*/rules.ts` / legal-move / scoring path deltas that would block M-MP-2 under the owner hard rule.

| Gate | Result at `c5927c13` |
| --- | --- |
| `src/games/*/ai.ts` vs alpha | **IDENTICAL** |
| `src/games/*/ai-client.ts` vs alpha | **IDENTICAL** |
| `src/games/*/tutorial.ts` vs alpha | **IDENTICAL** |
| `src/games/*/board-ui.ts` vs alpha | **IDENTICAL** |
| `src/games/*/rules.ts` vs alpha | **IDENTICAL** |
| Legal-move / scoring path files under `src/games/` | **no tip↔alpha diffs** (no `*legal*` / `*scor*` path deltas) |
| Controller deltas | lifecycle-only `destroyGame` mount cleanup (hex + fraction-pinball); **not** AI/copy/rules blockers |
| Hex Hard 450ms assert | **PRESENT** (`hard: 450` + unit pin ≤450) |
| Stars & Bars history cap | **ABSENT** (`slice(-15)` count = 0) |

**Named blockers for M-MP-2 AI/copy/rules:** *(none)*

---

## Why this recheck (vs q-mp-010)

`q-mp-010` issued **GO** at tip `6dc4afa0` (PR #598 head at that time), including an empty AI/copy string diff vs `alpha`. Tip ownership then moved under tip-owner `q-mp-026`, and tip head advanced to `c5927c13`.

This task re-diffs the **live** tip head so M-MP-2 land does not rely on the stale `6dc4afa0` snapshot.

```text
6dc4afa0  q-mp-010 GO tip (PR #598 head then)
c5927c13  live tip head (q-mp-009 docs fold only)
```

`git diff 6dc4afa0..c5927c13 -- src/` → **empty** (docs-only tip move).

---

## Method

```bash
git fetch origin alpha cursor/mp-tip-post477
TIP=c5927c1392fcb707f63d6c5890ddc294e50b511e
ALPHA=origin/alpha

git rev-list --left-right --count $ALPHA...$TIP
# → 0	16

git diff --quiet $ALPHA $TIP -- \
  src/games/*/ai.ts src/games/*/ai-client.ts \
  src/games/*/tutorial.ts src/games/*/board-ui.ts \
  src/games/*/rules.ts
# → exit 0 (identical)

git diff --name-status $ALPHA...$TIP -- 'src/games/'
# → only fraction-pinball + hex game-controller.ts

git diff $ALPHA...$TIP -- \
  src/games/*/ai.ts src/games/*/ai-client.ts \
  src/games/*/tutorial.ts src/games/*/game-controller.ts \
  src/games/*/board-ui.ts src/games/*/rules.ts

# Hard-rule pins
rg -n 'hard: 450' src/games/hex/ai.ts
rg -n 'toBeLessThanOrEqual\(450\)' tests/unit/ai-hard-midgame-identity.test.ts
rg -n 'slice\(-15\)' src/games/stars-bars/ || echo 'slice(-15) count = 0'
```

Open-draft overlap check: no open draft already delivers `docs/dev/mp-tip-ai-copy-recheck-2026-10-09.md`. Related held audits (#570 Friday AI/copy, #627 q-mp-010 preflight) cover older tip SHAs / different deliverables — this recheck is the live-tip delta only. **No other-PR comments** (hard rule).

---

## A. AI behavior (search / scoring / difficulty / timing)

| Surface | Tip vs `alpha` | Notes |
| --- | --- | --- |
| All `src/games/*/ai.ts` | identical | No search / scoring / difficulty / deadline hunks |
| All `src/games/*/ai-client.ts` | identical | No worker / watchdog timing deltas |
| AI think/place delays in other controllers | no tip↔alpha product AI path diffs beyond destroy hooks below | — |

### Controller paths that differ (lifecycle only — not AI behavior)

| File | Tip delta | AI search/score/difficulty/timing? | Player-facing copy? |
| --- | --- | --- | --- |
| `src/games/hex/game-controller.ts` | `destroyGame` clears board/status via `clearElement` (q-mp-030) | no | no |
| `src/games/fraction-pinball/game-controller.ts` | `destroyGame` clears `gameContainer` via `clearElement` (q-mp-030) | no | no |

These match the lifecycle-only notes in q-mp-010 §4. They are **not** named M-MP-2 AI/copy blockers.

---

## B. Player-facing copy / tutorial / rules-text

| Surface | Tip vs `alpha` | Verdict |
| --- | --- | --- |
| `src/games/*/tutorial.ts` | identical | **EMPTY** |
| `src/games/*/board-ui.ts` | identical | **EMPTY** |
| Controller string tokens in tip↔alpha controller diffs | only `dom-security` import path + destroy comments | **EMPTY** (no You/Computer/thinking/help/tutorial HTML deltas) |

---

## C. `*/rules.ts` / legal-move / scoring paths

| Check | Result |
| --- | --- |
| `git diff --name-status origin/alpha...TIP -- '**/rules.ts'` | empty |
| Tip `src/games/**/rules.ts` (20 games) vs alpha | all identical |
| Tip↔alpha path deltas matching `*legal*` / `*scor*` under `src/games/` | none |
| Broader `src/games/` name-status | only the two lifecycle controllers above |

**No legal-move or scoring logic path deltas** tip vs alpha.

---

## D. Hard-rule pins (still required for land)

| Pin | Evidence on tip `c5927c13` | Result |
| --- | --- | --- |
| Hex Hard 450ms | `src/games/hex/ai.ts:21` → `hard: 450,` | **PASS** |
| Hex Hard unit pin | `tests/unit/ai-hard-midgame-identity.test.ts:63` → `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` | **PASS** |
| Stars & Bars history cap absent | `rg 'slice\(-15\)' src/games/stars-bars/` → no matches | **PASS** |

---

## E. Tip drift since q-mp-010 GO (`6dc4afa0` → `c5927c13`)

| Commit | Summary | Touches AI/copy/rules product? |
| --- | --- | --- |
| `c5927c13` | `docs(dev): burn-1008 report-only draft index (q-mp-009)` | **no** |

Product tree under `src/` is unchanged since the prior GO tip. AI/copy/rules emptiness at `6dc4afa0` still holds at live `c5927c13`.

---

## F. Relation to Friday held AI/copy audit (#570)

Older tip `cursor/integration-fold-wave5-tip-4af0` carried many HELD AI/copy hunks vs alpha (`docs/dev/friday-ai-copy-audit.md`). Live tip `cursor/mp-tip-post477` at `c5927c13` does **not** carry those product deltas — AI/copy/rules globs are byte-identical to current `alpha`. This recheck does not re-open held drafts (#468/#488/#487/#492/#559); it only reports live tip↔alpha emptiness.

---

## Process notes (not AI/copy blockers)

1. Worker agents do not merge / mark ready / push `alpha`. Tip owner folds this doc into the tip; only Grok Bot squash-merges tip → `alpha` after GitHub checks green + mergeable clean.
2. Tip PR #598 already bases on `alpha` (fast-forward). No retarget required for AI/copy reasons.
3. This PR does not re-run full M-MP-2 preflight (check-run table / dry-run merge) — that remains q-mp-010’s GO at `6dc4afa0`, with tip drift since then limited to docs.

---

## Files changed (this PR)

- `docs/dev/mp-tip-ai-copy-recheck-2026-10-09.md` (new; only deliverable)

Next action: fold into tip by the tip owner
