# MP deploy land checklist — Fri 2026-10-09 tip → `alpha`

**Task:** `q-mp-031b` · **Report-only** · **Audience:** tip owner / Grok Bot (M-MP-1)  
**Lander:** Fri **1:31 PM ET** — tip `cursor/mp-tip-post477` → `alpha`  
**Do not:** merge, deploy, edit workflows, or push `alpha`/`main` from this note.

Stacks on draft **[#587](https://github.com/fuzzywigg/math-pentathlon/pull/587)** (`q-mp-023` alpha-push Deploy blast radius). That report documented the live `.github/workflows/deploy.yml` path; this checklist refreshes it for the **post-#477** tip with a **live tip SHA** and a short post-merge verify / revert gate.

Related (not duplicated): rollback git recipe in `docs/dev/merge-window-decision-sheet-2026-10-09.md` §4; short pointer in `docs/wiki/development.md`.

---

## Live tip context (read at authoring)

| Field | Value |
| --- | --- |
| **Tip branch** | `cursor/mp-tip-post477` |
| **Tip SHA (full)** | `c5927c1392fcb707f63d6c5890ddc294e50b511e` |
| **Tip SHA (short)** | `c5927c13` |
| Tip subject | `docs(dev): burn-1008 report-only draft index (q-mp-009)` |
| Tip commit time (UTC) | `2026-10-09 04:32:14 +0000` |
| **`alpha` SHA** | `5d1433e1ea8081acd309bede4261c90d8c5c52aa` (`#477` land) |
| Tip vs `alpha` | `0` behind / `16` ahead (`git rev-list --left-right --count origin/alpha...TIP`) |
| Merge-base | `5d1433e1` (== current `alpha`) — fast-forward stack |

Re-confirm SHA before land: `git fetch origin cursor/mp-tip-post477 && git rev-parse origin/cursor/mp-tip-post477`.

---

## Cloudflare Pages path (from live `deploy.yml`)

Confirmed on tip tree `c5927c13` by reading `.github/workflows/deploy.yml` (same facts as #587; line refs unchanged):

| Fact | Live workflow |
| --- | --- |
| **Trigger** | `push` to **`alpha` only** + `workflow_dispatch` (L2–5) |
| **Build** | `npm ci` → `npm run build` → publish `dist/` (L32–33, then L70–75) |
| **Pages project** | `math-pentathlon`; create-if-missing sets `production_branch":"alpha"` (L34–69, L61) |
| **Deploy command** | `pages deploy dist --project-name=math-pentathlon --branch=alpha` (L75) |
| **Public host** | `https://math.pappas.work` CNAME → `math-pentathlon.pages.dev` (L76–157) |
| **Concurrency** | `deploy-${{ github.ref }}`, `cancel-in-progress: true` (L15–17) |
| **Secrets** | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` |

**Production answer:** an `alpha` push **does** deploy production. Cloudflare Pages production branch is `alpha`; the player-facing site is `https://math.pappas.work`. There is **no** Deploy trigger on `main`.

---

## CI dependency: none

`deploy.yml` has **no** `needs:`, **no** `workflow_run`, and **no** reference to `ci.yml` (`rg` exit 1 on tip `c5927c13`).

| Question | Answer |
| --- | --- |
| Does Deploy wait for CI? | **No.** |
| Can a red CI still deploy if the commit is on `alpha`? | **Yes** — protection is branch-protection / process, not this workflow. |
| Can a failed `npm run build` inside Deploy publish? | **No** — wrangler runs only after a successful build. |

Process still requires green CI on the tip PR before Grok Bot squash-merges to `alpha`. Do not treat Deploy as a CI gate.

Recent evidence (read-only, 2026-10-09): newest `alpha` Deploy run `37878397515` — **success**, event **push**, title “Tip fold wave5… (#477)”, ~57s. Prior four `alpha` Deploys also **success**.

---

## Post-merge verify checklist (mandatory)

After the tip → `alpha` squash-merge (tip owner folds; **only Grok Bot** merges tip → `alpha`):

1. **Deploy workflow success**
   ```bash
   gh run list --repo fuzzywigg/math-pentathlon --workflow deploy.yml --branch alpha --limit 3
   ```
   Newest run must be **success** for the land commit. If **failure** / stuck / cancelled without a later success → go to **Immediate revert**.

2. **Site load**
   - Hard-refresh `https://math.pappas.work` (and `/#/`).
   - Expect: home/menu loads (division cards visible); no blank shell; no uncaught console errors on open.
   - Optional spot: open one known-good game hash (e.g. `#/game/hex`) — board accepts input.
   - If menu blank or shell broken → go to **Immediate revert**.

3. **Immediate revert if either fails**
   - Prefer git revert of the land commit (or squash SHA) on `alpha` so Deploy **re-fires** with the restored tree — see `docs/dev/merge-window-decision-sheet-2026-10-09.md` §4 (Option A/B).
   - Agents must **not** push `alpha`; human / Grok Bot only.
   - If git on `alpha` is correct but Pages is wrong: `gh workflow run deploy.yml --ref alpha` (Option C) — do **not** change DNS unless deploy docs require it.
   - Stop further playtesting until Deploy is green and the site loads again.

---

## Operator one-liner for 1:31 PM ET

Land tip `c5927c13` (`cursor/mp-tip-post477`) → `alpha` = **live publish** to Cloudflare Pages `math-pentathlon` / `math.pappas.work` with **no CI wait**. Verify **Deploy success + site load**; **revert immediately** if either fails.

---

## Duplication / stacking notes

| Item | Status |
| --- | --- |
| Draft #587 (`q-mp-023`) | Open; blast-radius table + CI-coupling answer — **facts reused here**; doc file not yet on tip |
| This file | New lander checklist only — verify + tip SHA + revert gate for Fri 1:31 PM ET |
| Open-PR scan | No open PR already owning `mp-deploy-land-checklist-2026-10-09`; `q-mp-031` (#589) is WebGL lifecycle tests (unrelated) |
| Scope | Report-only; **only** this file |

---

## Verification appendix (authoring tree)

Commands run on tip `c5927c1392fcb707f63d6c5890ddc294e50b511e`:

```bash
git rev-parse HEAD
git rev-parse origin/alpha
git rev-list --left-right --count origin/alpha...HEAD
rg -n 'needs:|workflow_run|ci\.yml' .github/workflows/deploy.yml; echo "rg_exit:$?"
rg -n 'branches:|concurrency|pages deploy|production_branch|math\.pappas\.work|cancel-in-progress|workflow_dispatch' .github/workflows/deploy.yml
gh run list --repo fuzzywigg/math-pentathlon --workflow deploy.yml --branch alpha --limit 5
gh pr view 587 --repo fuzzywigg/math-pentathlon --json number,title,isDraft,state,url,baseRefName
```

**Results:** tip `c5927c13` / alpha `5d1433e1` / `0	16` ahead; CI-coupling `rg` exit **1**; Pages path `--project-name=math-pentathlon --branch=alpha` + `math.pappas.work`; last five `alpha` Deploys **success**; #587 open draft (blast radius).
