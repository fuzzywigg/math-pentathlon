# q-mp-279 — CI permissions / persist-credentials pin audit

**Task id:** `q-mp-279`  
**Role:** worker (docs + pin test; no workflow edits)  
**Tip:** `cursor/mp-tip-post755` @ `74a1596f`  
**Verdict:** PASS — least-privilege pins hold; do not widen.

## Hard-rule pins

| Pin | Required | Live tip |
| --- | --- | --- |
| Workflow `permissions.contents` | `read` | `ci.yml:16`, `deploy.yml:12` |
| Every `actions/checkout` | `persist-credentials: false` | 12× in `ci.yml`, 1× in `deploy.yml` |
| Extra write scopes on CI | none | `ci.yml` has only `contents: read` |
| Deploy extra write | `deployments: write` only (allowlisted) | `deploy.yml:13` |

Enforced by `npm run check:workflows` (`scripts/check-workflows.mjs`) and unit pins in `tests/unit/workflow-contract.test.ts` + `tests/unit/ci-permissions-persist-credentials-pin.test.ts`.

## `ci.yml` line citations (`74a1596f`)

Top-level permissions:

```text
15:permissions:
16:  contents: read
```

Twelve jobs, each with `actions/checkout` + `persist-credentials: false`:

| Job | Checkout line | `persist-credentials: false` |
| --- | ---: | ---: |
| `lint` | 28 | 30 |
| `audit` | 51 | 53 |
| `build` | 68 | 70 |
| `unit` | 117 | 119 |
| `e2e` | 140 | 142 |
| `e2e-fullgame` | 185 | 187 |
| `mobile-touch` | 238 | 240 |
| `zoom-reflow` | 290 | 292 |
| `forced-colors` | 343 | 345 |
| `e2e-cross-browser` | 396 | 398 |
| `knip` | 442 | 444 |
| `visual-baseline` | 471 | 473 |

**Count:** 12 checkouts ↔ 12 `persist-credentials: false`. No `persist-credentials: true`. No `contents: write` in the permissions block (comments may mention the forbidden scope).

## `deploy.yml` line citations

```text
11:permissions:
12:  contents: read
13:  deployments: write
…
24:      - uses: actions/checkout@…
26:          persist-credentials: false
```

`deployments: write` is the only allowlisted extra scope in `scripts/check-workflows.mjs` (`EXTRA_WRITE_ALLOWLIST`).

## Remeasure commands

```bash
rg -n 'permissions:|persist-credentials|contents:' .github/workflows/ci.yml
rg -n 'permissions:|persist-credentials|contents:|deployments:' .github/workflows/deploy.yml
npm run check:workflows
npm run check:dev-docs
npx vitest run --project unit-shared tests/unit/ci-permissions-persist-credentials-pin.test.ts
```

## Non-goals

- No edits to workflow job steps, triggers, or caches.
- No permission widening (`contents: write`, `pull-requests`, etc.).
- No AI / rules / scoring / copy / ratchet / knip changes.
