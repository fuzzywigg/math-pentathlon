# q-mp-439 — CI permissions / persist-credentials pin re-audit (tip post898)

**Task id:** `q-mp-439`  
**Role:** worker (report-only docs + data; **no** workflow edits)  
**Tip measured (live):** `cursor/mp-tip-post898` @ `9b19c5e8`  
**Measured on:** 2026-10-10 (UTC) · stamp `2026-10-10T08:26:31Z`  
**Verdict:** **PASS** — least-privilege pins still hold; do not widen.

Machine-readable twin: [`ci-permissions-persist-credentials-pin-audit-q-mp-439.json`](./ci-permissions-persist-credentials-pin-audit-q-mp-439.json).  
Visual: [`ci-permissions-persist-credentials-pin-audit-q-mp-439.svg`](./ci-permissions-persist-credentials-pin-audit-q-mp-439.svg).

Leaves open prior audits **contained** (documented here only; no PR comments per worker constraints):

- [#903](https://github.com/fuzzywigg/math-pentathlon/pull/903) `q-mp-414` — tip stamp `7f8a7147` / base `cursor/mp-tip-post865`; audit doc + JSON already on tip via folds. Leave open; this sibling is the post898 remeasure.
- [#853](https://github.com/fuzzywigg/math-pentathlon/pull/853) `q-mp-363` — tip stamp `97487de6` / base `cursor/mp-tip-post830`; audit doc + JSON already on tip. Leave open.
- [#783](https://github.com/fuzzywigg/math-pentathlon/pull/783) `q-mp-279` — tip stamp `74a1596f` / base `cursor/mp-tip-post755`; audit doc + unit pin already on tip. Leave open.

## Spec drift (post865 → post898)

| Claim (backlog `q-mp-439` @ 10e)                                                                                  | Live post898 @ `9b19c5e8`                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Tip post898 (cut from alpha `946d6f95` after tip `#898`)                                                          | Tip SHA **`9b19c5e8`** (`fix(q-mp-026m): reconcile lint ceilings after #916 fold (min wins)`)      |
| “Live `.github/workflows/ci.yml` has workflow `permissions:` + **12** checkout `persist-credentials: false` pins” | **Confirmed:** `ci.yml` **12** + `deploy.yml` **1** (same as `q-mp-414` / `q-mp-363` / `q-mp-279`) |
| Tip already carries post865 `q-mp-414` audit — re-stamp for post898 SHA                                           | Prior tip sibling `q-mp-414` @ post865 `7f8a7147` present under `docs/dev/…-q-mp-414.{md,json}`    |
| Unit-file context (backlog suite **3224**)                                                                        | Live `find tests/unit -name '*.ts' \| wc -l` → **3249** (context only; not a workflow pin)         |

No workflow permission / apt / network-in-tests changes in this task.

## Hard-rule checklist

| Pin                                    | Required                                | Live @ `9b19c5e8`                                | Status |
| -------------------------------------- | --------------------------------------- | ------------------------------------------------ | ------ |
| Workflow `permissions.contents`        | `read`                                  | `ci.yml:16`, `deploy.yml:12`                     | PASS   |
| Every `actions/checkout`               | `persist-credentials: false`            | 12× `ci.yml` + 1× `deploy.yml`                   | PASS   |
| Extra write scopes on CI               | none                                    | `ci.yml` permissions = `{ contents: read }` only | PASS   |
| Deploy extra write                     | `deployments: write` only (allowlisted) | `deploy.yml:13`                                  | PASS   |
| `persist-credentials: true`            | absent                                  | none in `.github/workflows/`                     | PASS   |
| apt in CI                              | forbidden                               | no `apt` / `apt-get` hits in workflows           | PASS   |
| Permission widening / network-in-tests | forbidden                               | workflows untouched by this PR                   | PASS   |

Enforced by `npm run check:workflows` (`scripts/check-workflows.mjs`) and unit pins in `tests/unit/workflow-contract.test.ts` + `tests/unit/ci-permissions-persist-credentials-pin.test.ts` (unchanged by this PR).

## Summary table

| Workflow     | `permissions`                                                  | Checkout count | `persist-credentials: false` |
| ------------ | -------------------------------------------------------------- | -------------: | ---------------------------: |
| `ci.yml`     | `contents: read` only (`:15–16`)                               |         **12** |                       **12** |
| `deploy.yml` | `contents: read` + allowlisted `deployments: write` (`:11–13`) |          **1** |                        **1** |

## `ci.yml` pin sites (`9b19c5e8`)

Top-level permissions:

```text
15:permissions:
16:  contents: read
```

Twelve jobs, each with `actions/checkout` + `persist-credentials: false`:

| Job                 | Checkout line | `persist-credentials: false` | Pin |
| ------------------- | ------------: | ---------------------------: | --- |
| `lint`              |            28 |                           30 | ✅  |
| `audit`             |            51 |                           53 | ✅  |
| `build`             |            68 |                           70 | ✅  |
| `unit`              |           117 |                          119 | ✅  |
| `e2e`               |           140 |                          142 | ✅  |
| `e2e-fullgame`      |           185 |                          187 | ✅  |
| `mobile-touch`      |           238 |                          240 | ✅  |
| `zoom-reflow`       |           290 |                          292 | ✅  |
| `forced-colors`     |           343 |                          345 | ✅  |
| `e2e-cross-browser` |           396 |                          398 | ✅  |
| `knip`              |           442 |                          444 | ✅  |
| `visual-baseline`   |           471 |                          473 | ✅  |

**Count:** 12 checkouts ↔ 12 `persist-credentials: false`. No `persist-credentials: true`. No `contents: write` in the permissions block (comments may mention the forbidden scope).

## `deploy.yml` pin sites

```text
11:permissions:
12:  contents: read
13:  deployments: write
…
24:      - uses: actions/checkout@…
26:          persist-credentials: false
```

`deployments: write` is the only allowlisted extra scope in `scripts/check-workflows.mjs` (`EXTRA_WRITE_ALLOWLIST`).

## Visual — pin coverage @ `9b19c5e8`

```mermaid
flowchart TB
  subgraph ci ["ci.yml · permissions: contents: read"]
    direction LR
    L[lint ✅] --- A[audit ✅] --- B[build ✅] --- U[unit ✅]
    E[e2e ✅] --- EF[e2e-fullgame ✅] --- M[mobile-touch ✅] --- Z[zoom-reflow ✅]
    F[forced-colors ✅] --- X[e2e-cross-browser ✅] --- K[knip ✅] --- V[visual-baseline ✅]
  end
  subgraph deploy ["deploy.yml · contents: read + deployments: write"]
    D[deploy ✅ persist-credentials: false]
  end
  Tip["tip cursor/mp-tip-post898 @ 9b19c5e8"] --> ci
  Tip --> deploy
```

```mermaid
xychart-beta
    title "Checkout persist-credentials:false pins per workflow @ 9b19c5e8"
    x-axis ["ci.yml", "deploy.yml"]
    y-axis "pinned checkouts" 0 --> 14
    bar [12, 1]
```

Inline SVG twin: [`ci-permissions-persist-credentials-pin-audit-q-mp-439.svg`](./ci-permissions-persist-credentials-pin-audit-q-mp-439.svg).

## Open-PR narrow

| Open draft                                                               | Overlap                                                                                         | Action                                                         |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [#903](https://github.com/fuzzywigg/math-pentathlon/pull/903) `q-mp-414` | Same series; stamps post865 `7f8a7147`; tip already carries its doc + JSON                      | **contained** — leave open (no comment per worker constraints) |
| [#853](https://github.com/fuzzywigg/math-pentathlon/pull/853) `q-mp-363` | Same series; stamps post830 `97487de6`; tip already carries its doc + JSON                      | **contained** — leave open                                     |
| [#783](https://github.com/fuzzywigg/math-pentathlon/pull/783) `q-mp-279` | Same series; stamps older tip `74a1596f` / base post755; tip already carries its doc + unit pin | **contained** — leave open                                     |
| Open tip drafts `#915`–`#921` into post898                               | No other open draft owns `q-mp-439` / post898 CI permissions re-audit                           | This draft is the live remeasure                               |
| Unfolded post865 `#900`–`#913`                                           | `#903` is the prior sibling; others unrelated                                                   | Do not duplicate; tip fold owns timeline                       |

## Remeasure commands (before = tip HEAD; after = this sibling only)

```bash
git rev-parse HEAD
# 9b19c5e8cd3cd714d745540539324766369a8688

rg -n 'permissions:|persist-credentials' .github/workflows/ci.yml
rg -n 'permissions:|persist-credentials|contents:|deployments:' .github/workflows/deploy.yml
npm run check:workflows
npm run check:dev-docs
npx vitest run --project unit-shared tests/unit/ci-permissions-persist-credentials-pin.test.ts
npm run verify
npm run test:unit
```

### Before metrics (tip `9b19c5e8`, workflows unchanged)

| Metric                                | Value                                   |
| ------------------------------------- | --------------------------------------- |
| `ci.yml` `permissions.contents`       | `read`                                  |
| `ci.yml` checkout / persist-false     | **12 / 12**                             |
| `deploy.yml` permissions              | `contents: read` + `deployments: write` |
| `deploy.yml` checkout / persist-false | **1 / 1**                               |
| `check:workflows`                     | OK — 2 file(s)                          |
| `check:dev-docs`                      | docs scanned **214**; problems **0**    |
| Unit files (`tests/unit/**/*.ts`)     | **3249**                                |

### After metrics (docs/data only)

Same workflow pin counts (files under `.github/workflows/` untouched). `check:dev-docs` gains this sibling (+ JSON + SVG).

## Non-goals

- No edits to workflow job steps, triggers, caches, or permissions.
- No permission widening (`contents: write`, `pull-requests`, etc.).
- No apt in CI; no network-in-tests enablement.
- No AI / rules / scoring / copy / ratchet / knip / `src/` / test-behavior changes.
- No ratchet JSON.
- No comments / labels / closes on other PRs.
