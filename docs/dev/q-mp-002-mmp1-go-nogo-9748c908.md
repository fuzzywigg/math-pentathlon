# q-mp-002 — M-MP-1 GO/NO-GO at tip `9748c908`

**Task id:** `q-mp-002`  
**Role:** worker (report-only)  
**Depends on:** q-mp-001 pushed (head `9748c908` ≠ `dff8c013`) and its checks finished  
**Audience:** tip owner + Grok Bot (M-MP-1 land window)  
**Deliverable:** this doc only. No product code, no other-PR comments/labels/edits/closes/folds.

| Field | Value |
| --- | --- |
| Tip SHA audited | `9748c9089090bbfdce9d5b34f8a59c784ba92f18` (`9748c908`) |
| Tip branch | `cursor/integration-fold-wave5-tip-4af0` |
| Tip PR | [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) (draft; tip owner finished) |
| Alpha | `eec2b327c1e65586537cbe03b1c29b93065dee03` (`eec2b327`) |
| Divergence | `0` behind / **554** ahead of `alpha` (alpha is ancestor → fast-forward stack) |
| #477 base (live) | `cursor/integration-fold-wave4-tip-36e4` — **not** `alpha` |
| #477 mergeable | `MERGEABLE` / `mergeStateStatus=CLEAN` |
| Prior AI/copy audit | [`docs/dev/friday-ai-copy-audit.md`](friday-ai-copy-audit.md) (post-restore **CLEAN** at older tip; re-checked here at `9748c908`) |
| Deploy blast (companion) | [#587](https://github.com/fuzzywigg/math-pentathlon/pull/587) / `q-mp-023` |

---

## Verdict

### **GO** — tip `9748c908` for M-MP-1 (GitHub check runs + AI/copy + dry-run merge)

Technical gates at exact SHA `9748c9089090bbfdce9d5b34f8a59c784ba92f18` are green:

1. **GitHub check runs:** 22/22 success on the tip commit (11 unique job names × 2 CI workflow runs; all `conclusion=success`).
2. **Friday AI/copy re-audit at this SHA:** **CLEAN** (Hex+Kwatro KEEP; Queens/Kings/Contig AI + delays + tutorials + status restored; Stars & Bars uncapped; Hex Hard `450` remains).
3. **Dry-run merge into scratch `alpha`:** clean (`git merge --no-commit --no-ff` exit 0, 0 conflicts). Never pushed.

### Process preconditions (not optional before land)

1. **Retarget #477 base from `cursor/integration-fold-wave4-tip-36e4` → `alpha` before any merge.** Live base is still wave4-tip; squash into `alpha` must not proceed while base is wrong.
2. **Worker agents do not merge / mark ready / push `alpha`.** Tip owner folds worker docs into the tip; only Grok Bot squash-merges tip → `alpha` after GitHub checks green + mergeable clean.
3. **Alpha push deploys production with no CI gate** (see §Deploy). A merge to `alpha` publishes `https://math.pappas.work` via `.github/workflows/deploy.yml` even if CI were red on that commit.

**Do not merge or mark #477 ready from this worker PR.**

---

## 1. GitHub check-run table for `9748c908`

Source: GitHub Checks API for commit `9748c9089090bbfdce9d5b34f8a59c784ba92f18` (not agent-local).  
PR #477 `statusCheckRollup`: **22** completed entries, all `SUCCESS` / `COMPLETED`; `mergeable=MERGEABLE`, `mergeStateStatus=CLEAN`.

Deduplicated to latest completion per job name:

| Check | Status | Conclusion | Completed (UTC) | Job |
| --- | --- | --- | --- | --- |
| `audit` | `completed` | `success` | 2026-10-08T23:01:32Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583526828) |
| `build` | `completed` | `success` | 2026-10-08T23:02:04Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583644512) |
| `e2e` | `completed` | `success` | 2026-10-08T23:05:32Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583820434) |
| `e2e-cross-browser` | `completed` | `success` | 2026-10-08T23:11:39Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583820564) |
| `e2e-fullgame` | `completed` | `success` | 2026-10-08T23:04:07Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583820466) |
| `forced-colors` | `completed` | `success` | 2026-10-08T23:03:02Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583820414) |
| `lint` | `completed` | `success` | 2026-10-08T23:02:11Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583526972) |
| `mobile-touch` | `completed` | `success` | 2026-10-08T23:04:17Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857017984/job/113583757108) |
| `unit` | `completed` | `success` | 2026-10-08T23:08:05Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583526690) |
| `visual-baseline` | `completed` | `success` | 2026-10-08T23:03:55Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583526900) |
| `zoom-reflow` | `completed` | `success` | 2026-10-08T23:03:08Z | [link](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37857020924/job/113583820622) |

Required land jobs (`lint`, `unit`, `build`, `e2e`) are green on GitHub.

```bash
gh api repos/fuzzywigg/math-pentathlon/commits/9748c9089090bbfdce9d5b34f8a59c784ba92f18/check-runs --paginate \
  --jq '[.check_runs[] | {name, status, conclusion, completed_at, html_url}] | group_by(.name) | map(sort_by(.completed_at) | last) | sort_by(.name)'
gh pr view 477 --repo fuzzywigg/math-pentathlon --json baseRefName,headRefOid,mergeable,mergeStateStatus,isDraft
```

---

## 2. Base retarget (explicit)

| Item | Live value | Required before merge to `alpha` |
| --- | --- | --- |
| #477 `baseRefName` | `cursor/integration-fold-wave4-tip-36e4` | **`alpha`** |
| Tip head | `9748c908` | unchanged |
| Stack vs alpha | 0 behind / 554 ahead; `origin/alpha` is ancestor of tip | fast-forward-capable once base is `alpha` |

Dry-run below proves tip content merges cleanly into `alpha`. Retarget is a GitHub PR metadata step for the tip owner / Grok Bot — this worker does not change #477.

---

## 3. Dry-run merge tip → scratch `alpha` (never pushed)

```bash
TIP=9748c9089090bbfdce9d5b34f8a59c784ba92f18
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

## 4. Friday AI/copy re-audit at `9748c908` vs `origin/alpha`

Method (same surfaces as `friday-ai-copy-audit.md`):

```bash
TIP=9748c9089090bbfdce9d5b34f8a59c784ba92f18
git diff origin/alpha...$TIP -- \
  src/games/*/ai.ts src/games/*/ai-client.ts \
  src/games/*/tutorial.ts src/games/*/game-controller.ts \
  src/games/*/board-ui.ts src/games/*/rules.ts
```

### Owner KEEP set (must remain)

| Surface | Tip evidence | Verdict |
| --- | --- | --- |
| Hex Hard deadline **450** | `src/games/hex/ai.ts` `hard: 450` | **KEEP** |
| Hex Hard assert | `tests/unit/ai-hard-midgame-identity.test.ts` `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` | **KEEP** (pins ≤450; value is 450) |
| Hex `ai-client` watchdog | tip-only `deadlineMs + 1500` race | **KEEP** |
| Kwatro AI | tip has `AI_THINK_BUDGET_MS=50`, randomness `0.35/0.12/0.02`, `countOnNumbered` heuristics (alpha still `0.5/0.15/0.03`, no budget) | **KEEP** |

### Restored / emit-identical to alpha (must stay)

| Surface | Tip vs alpha | Verdict |
| --- | --- | --- |
| Queens Hard deadline | tip `hard: 2500` (= alpha) | **RESTORED** |
| Contig AI behavior | tip↔alpha diff = `import type` only; Hard `lookahead: true` on both | **RESTORED** |
| Kings AI behavior | tip↔alpha diff = `import type` only | **RESTORED** |
| Queens AI behavior | tip↔alpha diff = `import type` only | **RESTORED** |
| Think/place delay constants (11 controllers) | normalized `AI_*` constant **values** match alpha (e.g. Hex 500, Hex-a-Gone 800, Calla 800, Star Track 600) | **RESTORED** |
| Tutorials (all 20) | tip↔alpha = `import type { TutorialConfig }` only; bodies match | **RESTORED** |
| Status / You–Computer sample set | matching status strings on calla/contig/hex/kings/queens/stars-bars paths | **RESTORED** |
| Stars & Bars history | uncapped reverse loop over full `moveHistory`; **`slice(-15)` count = 0** on tip | **COMPLIANT** |

### AI/copy verdict

**CLEAN** at `9748c908` — no remaining HELD AI/copy deltas vs `origin/alpha` except the explicit **KEEP** set (Hex AI + `ai-client` + Kwatro AI). Tutorials/delays/Queens-Kings-Contig AI/status chrome stay restored.

---

## 5. String-literal diff vs `alpha` (summary)

Scoped to changed `src/games/**/{ai,ai-client,tutorial,board-ui,game-controller,rules}.ts` paths.

| Bucket | Finding |
| --- | --- |
| Player status chrome (`Computer is thinking…`, `You win!`, seat labels) | **No net status-keyword literal drift** on the restored status sample files |
| Tutorials | No body string deltas (import-type only) |
| Kwatro teaching / heuristic labels | Tip-added strings under KEEP Kwatro AI (e.g. numbered-space teaching hints) — expected KEEP, not a restore failure |
| Template / class-name churn | FIAR / Remainder Islands class-string construction differences (non-player-copy chrome) |

Human-looking tip-added literals are dominated by Kwatro KEEP teaching labels and non-copy UI class fragments — not a reintroduction of held You/Computer tutorial bodies.

---

## 6. Alpha-push Deploy (`deploy.yml` / q-mp-023 / #587)

Live tree `.github/workflows/deploy.yml` at tip:

| Topic | Fact |
| --- | --- |
| Trigger | `push` → `branches: [alpha]` + `workflow_dispatch` |
| CI gate | **None** — no `needs:`, no `workflow_run`, no reference to `ci.yml` |
| Build inside Deploy | `npm ci` + `npm run build` (failed build stops publish) |
| Target | `wrangler pages deploy dist --project-name=math-pentathlon --branch=alpha` |
| Production branch | Cloudflare Pages `production_branch: alpha` |
| Public host | `math.pappas.work` CNAME → `math-pentathlon.pages.dev` |
| Permissions | `contents: read`, `deployments: write`; checkout `persist-credentials: false` |
| Concurrency | `deploy-${{ github.ref }}`, `cancel-in-progress: true` |

**Implication for M-MP-1:** merging tip into `alpha` **will deploy production** immediately on the push. Red CI on that SHA does not block Deploy. Companion report: [#587](https://github.com/fuzzywigg/math-pentathlon/pull/587).

---

## 7. Open-PR duplication check

```bash
gh pr list --repo fuzzywigg/math-pentathlon --state open --search 'q-mp-002 OR "M-MP-1" OR "GO/NO-GO"' --limit 10
```

No prior open worker PR delivering this M-MP-1 GO/NO-GO at `9748c908`. Related but not duplicate: #569 (preflight), #570 (HOLD AI/copy at older SHA), #587 (deploy blast), #586 (stack promotion tip→alpha — separate).

---

## 8. Local verification (agent tree at `9748c908`)

Environment notes (agent-local only; GitHub already green):

1. First `npm run build` failed: missing `rollup-plugin-visualizer` → fixed with `npm ci`.
2. First `npm run test:e2e:chromium` failed: Playwright Chromium not installed → fixed with `npx playwright install chromium`.

| Command | Exit | Result |
| --- | --- | --- |
| `npm run lint` | **0** | clean |
| `npm run lint:ratchet` | **0** | `curly: 1320 / ceiling 1320` |
| `npm run format:check` | **0** | All matched files use Prettier |
| `npm run typecheck` | **0** | clean |
| `npm run typecheck:ratchet` | **0** | in-scope 0; Phase-2 ceiling 216 ≤ 216 |
| `npm run check:boundaries` | **0** | under ceiling |
| `npm run test:unit` | **0** | 3106 files; 11930 passed / 26 skipped / 22 todo |
| `npm run build` | **0** | after `npm ci` |
| `npm run test:e2e:chromium` | **0** | **249 passed** (2.8m) after Playwright install |

GitHub check runs on this worker draft PR (math CI on PRs into `cursor/**`) must also show `lint`, `unit`, `build`, `e2e` green after push.

---

## One-line summary

**GO** at `9748c908` — GitHub 22/22 success, AI/copy **CLEAN**, dry-run into `alpha` clean; **retarget #477 base to `alpha` before Grok Bot squash-merge**; alpha push = production deploy with no CI gate.
