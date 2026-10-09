# Landing preflight v4 — tip `cursor/mp-tip-post477` → `alpha` (M-MP-2)

**Task id:** `q-mp-010`  
**Role:** worker (report-only)  
**Audience:** tip owner + Grok Bot (M-MP-2 land window)  
**Deliverable:** this doc only. No product code, no other-PR comments/labels/edits/closes/folds/merges.

| Field | Value |
| --- | --- |
| Tip SHA audited | `6dc4afa0b908aec759843046603e45e8bfe91a92` (`6dc4afa0`) |
| Tip branch | `cursor/mp-tip-post477` |
| Tip PR | [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) (draft; base=`alpha`) |
| Alpha at test | `5d1433e1ea8081acd309bede4261c90d8c5c52aa` (`5d1433e1`) |
| Divergence | `0` behind / **15** ahead of `alpha` (alpha is ancestor → fast-forward stack) |
| #598 mergeable | `MERGEABLE` / `mergeStateStatus=CLEAN` / `isDraft=true` |
| Prior M-MP-1 GO/NO-GO | [`q-mp-002-mmp1-go-nogo-9748c908.md`](q-mp-002-mmp1-go-nogo-9748c908.md) at older tip `9748c908` |
| Prior preflight | [`alpha-landing-preflight-2026-10-08.md`](alpha-landing-preflight-2026-10-08.md) / Friday v2 (#569) |

---

## Verdict

### **GO** — tip `6dc4afa0` for M-MP-2 (GitHub check runs + AI/copy string empty + dry-run merge)

Technical gates at exact SHA `6dc4afa0b908aec759843046603e45e8bfe91a92` (PR #598 head):

1. **GitHub check runs:** 11/11 unique CI jobs `conclusion=success` on that commit (source: Checks API, not agent-local).
2. **AI/copy string diff vs `origin/alpha`:** **EMPTY** for player-facing / AI-behavior surfaces (`ai.ts`, `ai-client.ts`, `tutorial.ts`, `board-ui.ts`, `rules.ts` byte-identical). Two `game-controller.ts` paths differ by destroy-mount cleanup only (q-mp-030); no player-facing string deltas.
3. **Dry-run merge into scratch `alpha`:** clean (`merge_exit=0`, `conflicts=0`). Never pushed.
4. **Hex Hard 450ms assert:** **PRESENT** (`hard: 450` + unit pin `toBeLessThanOrEqual(450)`).
5. **Stars & Bars history cap:** **ABSENT** (`slice(-15)` count = 0; uncapped reverse loop over full `moveHistory`).

### Process preconditions (not optional before land)

1. **Worker agents do not merge / mark ready / push `alpha`.** Tip owner folds this worker doc into the tip; only Grok Bot squash-merges tip → `alpha` after GitHub checks green + mergeable clean.
2. **#598 already bases on `alpha`** (unlike historical #477 wave4 base). No retarget required for this tip PR.
3. **Alpha push deploys production** via `.github/workflows/deploy.yml` — land only when intentional.

**Do not merge or mark #598 ready from this worker PR.**

---

## 1. GitHub check-run table for `6dc4afa0`

Source: GitHub Checks API for commit `6dc4afa0b908aec759843046603e45e8bfe91a92` (workflow run [37882920306](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306)).  
PR #598 `statusCheckRollup`: **11** completed entries, all `SUCCESS` / `COMPLETED`; `mergeable=MERGEABLE`, `mergeStateStatus=CLEAN`.

Deduplicated to latest completion per job name:

| Check | Status | Conclusion | Completed (UTC) | Job |
| --- | --- | --- | --- | --- |
| `audit` | `completed` | `success` | 2026-10-09T04:14:40Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666449018) |
| `build` | `completed` | `success` | 2026-10-09T04:15:16Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666543661) |
| `e2e` | `completed` | `success` | 2026-10-09T04:19:46Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695543) |
| `e2e-cross-browser` | `completed` | `success` | 2026-10-09T04:21:55Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695494) |
| `e2e-fullgame` | `completed` | `success` | 2026-10-09T04:17:21Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695562) |
| `forced-colors` | `completed` | `success` | 2026-10-09T04:16:01Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695415) |
| `lint` | `completed` | `success` | 2026-10-09T04:15:05Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666448945) |
| `mobile-touch` | `completed` | `success` | 2026-10-09T04:16:18Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695542) |
| `unit` | `completed` | `success` | 2026-10-09T04:19:29Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666448966) |
| `visual-baseline` | `completed` | `success` | 2026-10-09T04:16:56Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666448816) |
| `zoom-reflow` | `completed` | `success` | 2026-10-09T04:16:28Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306/job/113666695400) |

Required land jobs (`lint`, `unit`, `build`, `e2e`) are green on GitHub.

```bash
gh api repos/fuzzywigg/math-pentathlon/commits/6dc4afa0b908aec759843046603e45e8bfe91a92/check-runs --paginate \
  --jq '[.check_runs[] | {name, status, conclusion, completed_at, html_url}] | group_by(.name) | map(sort_by(.completed_at) | last) | sort_by(.name)'
gh pr view 598 --repo fuzzywigg/math-pentathlon --json baseRefName,headRefOid,mergeable,mergeStateStatus,isDraft
```

---

## 2. Merge-base and divergence

```text
TIP    = 6dc4afa0b908aec759843046603e45e8bfe91a92
ALPHA  = 5d1433e1ea8081acd309bede4261c90d8c5c52aa
MERGE_BASE = 5d1433e1ea8081acd309bede4261c90d8c5c52aa   # == alpha
git rev-list --left-right --count origin/alpha...TIP  →  0	15
git diff --stat origin/alpha...TIP                    →  82 files, +2852 / −570
```

Tip is a **fast-forward stack** on top of current `alpha` (merge-base is `alpha` itself). Tip reanchor commit `91a6be7e` starts from land SHA `5d1433e1`.

---

## 3. Dry-run merge tip → scratch `alpha` (never pushed)

```bash
TIP=6dc4afa0b908aec759843046603e45e8bfe91a92
SCRATCH=$(mktemp -d /tmp/mp-alpha-merge-XXXX)
git fetch origin alpha
git worktree add --detach "$SCRATCH" origin/alpha
cd "$SCRATCH"
git merge --no-commit --no-ff "$TIP"
# → Automatic merge went well; stopped before committing as requested
# merge_exit=0  conflicts=0  MERGE_RESULT=clean
git merge --abort
cd - && git worktree remove --force "$SCRATCH"
```

**Result:** `merge_exit=0`, `conflicts=0`, `MERGE_RESULT=clean`. Scratch worktree removed; nothing pushed to `alpha` / `main` / tip.

---

## 4. AI/copy string diff vs `origin/alpha`

Method (same AI/copy surfaces as Friday audit / q-mp-002):

```bash
TIP=6dc4afa0b908aec759843046603e45e8bfe91a92
git diff origin/alpha...$TIP -- \
  src/games/*/ai.ts src/games/*/ai-client.ts \
  src/games/*/tutorial.ts src/games/*/game-controller.ts \
  src/games/*/board-ui.ts src/games/*/rules.ts
```

### Identity (must stay empty for AI/copy behavior + copy surfaces)

| Surface glob | Tip vs alpha | Verdict |
| --- | --- | --- |
| `src/games/*/ai.ts` | identical (`diff --quiet`) | **EMPTY** |
| `src/games/*/ai-client.ts` | identical | **EMPTY** |
| `src/games/*/tutorial.ts` | identical | **EMPTY** |
| `src/games/*/board-ui.ts` | identical | **EMPTY** |
| `src/games/*/rules.ts` | identical | **EMPTY** |

### Path-level deltas on controllers (lifecycle only — not AI/copy strings)

| File | Tip delta | Player-facing string delta | Verdict |
| --- | --- | --- | --- |
| `src/games/hex/game-controller.ts` | `destroyGame` clears board/status via `clearElement` (q-mp-030) | none (only import `'../../core/dom-security'`) | **not an AI/copy string blocker** |
| `src/games/fraction-pinball/game-controller.ts` | `destroyGame` clears `gameContainer` via `clearElement` (q-mp-030) | none (only import `'../../core/dom-security'`) | **not an AI/copy string blocker** |

### AI/copy string verdict

**EMPTY** at `6dc4afa0` — no player-facing copy / tutorial / rules-text / AI search-scoring-timing string deltas vs `origin/alpha`. No blockers listed.

---

## 5. Hex Hard 450ms assert (still present)

| Check | Evidence on tip `6dc4afa0` | Result |
| --- | --- | --- |
| Deadline constant | `src/games/hex/ai.ts:21` → `hard: 450,` | **PASS** |
| Unit pin | `tests/unit/ai-hard-midgame-identity.test.ts:63` → `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` | **PASS** |
| Comment contract | `src/games/hex/ai.ts:14` notes Hard ≤500ms wall / deadline 450ms | **PASS** |

---

## 6. Stars & Bars history cap (still absent)

| Check | Evidence on tip `6dc4afa0` | Result |
| --- | --- | --- |
| `slice(-15)` in `src/games/stars-bars/` | count = **0** | **PASS** (no cap) |
| History render loop | `src/games/stars-bars/board-ui.ts:677` → `for (let i = state.moveHistory.length - 1; i >= 0; i--)` uncapped | **PASS** |
| Cap keywords (`historyCap` / `HISTORY_CAP`) | no matches under `src/games/stars-bars/` | **PASS** |

---

## 7. Local verify commands (tip tree = `6dc4afa0`)

Run on tip checkout `6dc4afa0b908aec759843046603e45e8bfe91a92`. Full log: agent artifact `q-mp-010-verify.log`.

| Step | Command | Exit | Notes |
| --- | --- | ---: | --- |
| Lint | `npm run lint` | **0** | |
| Lint ratchet | `npm run lint:ratchet` | **0** | curly 896 / ceiling 896 |
| Format | `npm run format:check` | **0** | Prettier clean |
| Types | `npm run typecheck` | **0** | |
| Type ratchet | `npm run typecheck:ratchet` | **0** | in-scope 0; out-of-scope 216 ≤ baseline 216 |
| Boundaries | `npm run check:boundaries` | **0** | |
| Unit | `npm run test:unit` | **0** | 3107 files / 11937 passed / 24 skipped / 22 todo |
| Build | `npm run build` | **0** | Vite + PWA generateSW |
| E2E Chromium (1st) | `CI=true npm run test:e2e:chromium` | **1** | env: Playwright browsers missing (`chromium_headless_shell-1248`) — not product |
| Playwright install | `npx playwright install chromium` | **0** | |
| E2E Chromium (rerun) | `CI=true npm run test:e2e:chromium` | **0** | **249 passed** (2.6m) |
| GitHub checks | Checks API on tip head | **11/11 success** | authoritative land signal |

---

## 8. Duplicate / related open drafts

Checked open PR list before writing. No open draft already delivers **landing-preflight-v4** / `q-mp-010` for tip `cursor/mp-tip-post477` → `alpha`. Related but not duplicate:

| PR | Why distinct |
| --- | --- |
| #595 / q-mp-002 | M-MP-1 GO/NO-GO at older tip `9748c908` (wave5 tip) |
| #569 | Friday landing preflight v2 (older tip) |
| #570 | Friday AI/copy audit HOLD (older tip) |
| #586 | Stack promotion tip → alpha (separate ownership) |
| #598 | Tip itself (this preflight audits #598 head) |

This worker does not comment on, label, edit, close, or fold any of the above.

---

## 9. Tip commits ahead of `alpha` (15)

```text
6dc4afa0 docs(dev): q-mp-002 M-MP-1 GO/NO-GO at tip 9748c908
5d0ce540 docs(dev): q-mp-056 alpha required-checks recommendation (report-only)
1913661c docs(dev): q-mp-004 compliance review 9 of #581/#582/#584/#585
57774d21 docs(dev): q-mp-072 board3d WebGL lifecycle + SwiftShader shots
059bd037 docs(dev): q-mp-070 game route lifecycle sequence + per-game map
e57e40b8 docs(dev): q-mp-073 Mermaid map of ci.yml blocking vs report-only gates
8cbdcb60 chore(lint): re-measure curly:all ceiling to 896 after #590+#592+#596
8e35ee2f q-mp-042: curly:all braces in src/ui/three (−167 ceiling)
9d11d61b fix(lint): q-mp-041 curly:all braces in src/ui/** excl. three (−60)
bd53536b fix(lint): q-mp-040 curly:all braces in core/pwa/demos
a3205a32 fix(q-mp-030): clear hex/pinball mounts on destroyGame
bc280094 test(q-mp-030): fail on hex/pinball destroyGame leaving mount listeners
adc39f2d test(q-mp-031): add webglcontextlost lifecycle pins for pent-em-in and star-track
92f20aa3 docs(dev): q-mp-032 post-restore orphan symbol inventory + tip doc fixes
91a6be7e chore(tip): reanchor post-#477 tip at land SHA 5d1433e1
```

---

## Bottom line

**GO** at tip SHA `6dc4afa0b908aec759843046603e45e8bfe91a92` for M-MP-2 tip → `alpha`: GitHub 11/11 success, AI/copy strings empty vs alpha, dry-run merge clean, Hex Hard 450 present, Stars & Bars uncapped. Worker does not merge; tip owner folds this doc; Grok Bot squash-merges when ready.
