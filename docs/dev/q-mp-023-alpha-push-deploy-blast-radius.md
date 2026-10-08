# q-mp-023 — Alpha-push Deploy blast radius (`.github/workflows/deploy.yml`)

**Task:** q-mp-023 · **Report-only** · **Tree:** tip `9748c908` (math tip #477 head) · **Date:** 2026-10-08  
**Audience:** Grok Bot / M-MP-1 operators before folding #477 → `alpha`.  
**Scope:** Live read of `.github/workflows/deploy.yml` + recent Actions runs. No workflow edits.

Related (not duplicated): short deploy pointer in `docs/wiki/development.md`; rollback git recipe in `docs/dev/merge-window-decision-sheet-2026-10-09.md` §4. This doc answers the blast-radius questions those sheets leave implicit.

---

## Explicit answer — does a merge to `alpha` deploy to production?

**Yes.** Merging (or any other push) to GitHub branch `alpha` triggers workflow **Deploy** (`deploy.yml`). That job:

1. Builds `dist/` from the pushed commit.
2. Publishes it to Cloudflare Pages project **`math-pentathlon`** with **`--branch=alpha`** (L75).
3. Treats `alpha` as the Pages **production** branch when (re)creating the project (`production_branch":"alpha"`, L61).
4. Ensures public hostname **`https://math.pappas.work`** (CNAME → `math-pentathlon.pages.dev`, L76–127; Pages domain attach L128–157).

There is **no** Deploy trigger on `main`. Live player-facing site for this repo is the Cloudflare Pages production deployment of `alpha`, not a separate `main` pipeline.

---

## Trigger / target / rollback table (with line references)

| Topic | What the live workflow does | Line refs (`.github/workflows/deploy.yml`) |
| --- | --- | --- |
| **Triggers** | `push` to **`alpha` only**; also `workflow_dispatch` (manual). No `pull_request`, no `main`, no `workflow_run` on CI. | L2–5 |
| **Permissions** | `contents: read`, `deployments: write`. Checkout uses `persist-credentials: false`. | L11–13, L24–26 |
| **Concurrency** | Group `deploy-${{ github.ref }}`; **`cancel-in-progress: true`**. Rapid sequential `alpha` pushes cancel older Deploy runs mid-flight (observed: 5 cancelled in last 30 runs, Oct 3 burst). | L15–17 |
| **Runner / timeout** | `ubuntu-latest`, job timeout **20** minutes. | L20–22 |
| **Build gate inside Deploy** | `npm ci` then `npm run build` **must succeed** before wrangler publish. A failing build step stops the job; no Pages upload. | L32–33, L70–75 |
| **CI coupling** | **None.** No `needs:`, no `workflow_run` on `ci.yml`. A red CI run does **not** block Deploy if the commit is already on `alpha`. | (absent; verified by `rg`) |
| **Cloudflare project** | Name: `math-pentathlon`. Create-if-missing sets `production_branch` to **`alpha`**. | L34–69, L61 |
| **Deploy target** | `wrangler pages deploy dist --project-name=math-pentathlon --branch=alpha` | L70–75 |
| **Public URL / DNS** | Ensures CNAME `math.pappas.work` → `math-pentathlon.pages.dev` (proxied); attaches custom domain on the Pages project. Zone id hardcoded (not a secret). DNS failures warn and continue (soft). | L76–127 (`CLOUDFLARE_ZONE_ID` L79), L128–157 |
| **GitHub secrets used** | `secrets.CLOUDFLARE_ACCOUNT_ID`, `secrets.CLOUDFLARE_API_TOKEN` (project ensure, wrangler, DNS, domain attach). | L36–37, L73–74, L78, L130–131 |
| **Non-secret config in YAML** | Zone id `eee4dd09cd304e2acef7ffdc087881f2`; project name; domain `math.pappas.work`; Node `20`. | L29, L43, L61, L75, L79, L90 |
| **Rollback (git)** | Prefer revert (or revert-range) on `alpha` and push — that **re-triggers Deploy** with the restored tree. Agents must not push `alpha`; human / Grok Bot only. See merge-window sheet §4 for commands. | Trigger L2–4; deploy L75 |
| **Rollback (re-run)** | `gh workflow run deploy.yml --ref alpha` (or Actions UI) after `alpha` git is correct — rebuilds/publishes current tip without a new commit. | L5 (`workflow_dispatch`), L75 |
| **Rollback (Pages / DNS)** | Emergency only: wait for revert deploy, or re-dispatch Deploy. Do **not** change DNS unless deploy docs require it (merge-window sheet §4 Option C). Soft DNS steps already tolerate missing DNS edit scope. | L76–127 |
| **Can a red CI still deploy?** | **Yes, if the commit lands on `alpha`.** Deploy does not wait on CI. Protection against merge-with-red-CI is a GitHub branch-protection / process concern, not this workflow. | L2–5; no CI dependency |
| **Can a failed Deploy build publish?** | **No.** Publish is after `npm run build`. Build failure ⇒ no wrangler step. | L32–33 before L70–75 |
| **Blast radius of M-MP-1 land** | One successful merge/push to `alpha` → one Deploy job → overwrites Pages production for `math-pentathlon` / `math.pappas.work` with that commit’s `dist/`. Concurrent landings cancel prior deploys; last successful Deploy wins. | L15–17, L75 |

---

## Step sequence (what runs on an `alpha` push)

1. Checkout (no persisted credentials).
2. Node 20 + npm cache from `package-lock.json`.
3. `npm ci` → `npm run build`.
4. Ensure Cloudflare Pages project `math-pentathlon` exists (create with production branch `alpha` if missing).
5. `pages deploy dist` to project `math-pentathlon`, branch `alpha`.
6. Ensure DNS CNAME for `math.pappas.work` (warn-only on token/DNS errors).
7. Attach `math.pappas.work` as Pages custom domain if not already attached.

Typical successful run duration (recent): ~45–56s.

---

## Recent runs evidence (read-only)

Queried 2026-10-08 against `fuzzywigg/math-pentathlon`:

| Fact | Observation |
| --- | --- |
| Workflow | Deploy / `.github/workflows/deploy.yml` — **active**, 284 total runs |
| Last 5 `alpha` runs | All **success**, event **`push`**, branch **`alpha`** (newest: run `37688269279`, 2026-10-07T21:16:53Z, “docs(playtest)… (#414)”) |
| Last 30 runs | 25 success, 5 cancelled; **only** `push` events; **only** `alpha` head branch |
| Sample success steps | checkout → setup-node → npm ci → npm run build → Ensure project → Deploy to Cloudflare Pages → Ensure DNS → Attach custom domain (run `37688269279`) |
| Cancelled cluster | Oct 3 ~19:39–19:40Z — five cancelled pushes; consistent with `cancel-in-progress: true` under rapid `alpha` updates |

Open-PR scan: no other open draft titled/searchable as `q-mp-023` / “deploy blast” / “alpha-push-deploy” (this report fills that gap).

---

## Operator checklist before M-MP-1 (`#477` → `alpha`)

1. Treat land as a **live production publish** to `https://math.pappas.work`.
2. Require green CI on the tip PR by process; do not rely on Deploy to enforce it.
3. After merge: `gh run list --repo fuzzywigg/math-pentathlon --workflow deploy.yml --branch alpha --limit 3` — newest must be **success**.
4. Hard-refresh the live site; if menu/shell is broken, follow git revert → Deploy re-fire (merge-window sheet §4).
5. Expect overlapping Deploy runs to cancel earlier ones if multiple pushes land quickly.

---

## Verification appendix (commands + results)

Commands run on tip tree `9748c908` (worker branch cut from `cursor/integration-fold-wave5-tip-4af0`). Full transcript: `/opt/cursor/artifacts/q-mp-023-deploy-verify.log`.

### 1) Workflow head (triggers, concurrency, secrets, target)

```bash
cat -n .github/workflows/deploy.yml | sed -n '1,80p'
rg -n 'needs:|workflow_run|ci\.yml' .github/workflows/deploy.yml; echo "rg_exit:$?"
rg -n 'branches:|concurrency|secrets\.|pages deploy|production_branch|math\.pappas\.work|cancel-in-progress' .github/workflows/deploy.yml
```

**Result (abridged):** `on.push.branches: [alpha]` + `workflow_dispatch`; concurrency `cancel-in-progress: true`; secrets `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN`; deploy command `--project-name=math-pentathlon --branch=alpha`; `production_branch":"alpha"`; custom domain `math.pappas.work`. `rg` for CI coupling exited **1** (no matches).

### 2) Recent Deploy runs

```bash
gh run list --repo fuzzywigg/math-pentathlon --workflow deploy.yml --branch alpha --limit 5
gh run list --repo fuzzywigg/math-pentathlon --workflow deploy.yml --limit 30 --json conclusion,displayTitle,event,headBranch,databaseId,createdAt
gh run view 37688269279 --repo fuzzywigg/math-pentathlon --json jobs,conclusion,event,headBranch,displayTitle,url
```

**Result:** Last five `alpha` Deploys **success** / **push**. Last 30: 25 success + 5 cancelled; events=`["push"]`; branches=`["alpha"]`. Run `37688269279` completed all deploy steps including Cloudflare Pages publish + DNS + domain attach.

### 3) Duplication check

```bash
gh pr list --repo fuzzywigg/math-pentathlon --state open --search 'q-mp-023 OR "deploy blast" OR "alpha-push-deploy"' --limit 10
```

**Result:** empty (no prior open PR for this topic).
