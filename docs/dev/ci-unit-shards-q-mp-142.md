# q-mp-142 — CI `unit` job vitest-project matrix

**Task id:** `q-mp-142`  
**Role:** worker (CI / tests / docs)  
**Base tip:** `cursor/mp-tip-post700`  
**Workflow:** `.github/workflows/ci.yml` job `unit`

## Goal

Keep the blocking `unit` wall-clock comfortably under the **12m step / 14m job** budgets (target ~**8 min** per shard) without raising timeouts, as the tip unit tree grows past ~3.1k files.

## Matrix (live `ci.yml`)

| Matrix `project` | Vitest project (`vitest.config.ts`) | Role |
| --- | --- | --- |
| `unit-shared` | `unit-shared` | Default jsdom suite (`isolate: false`) — majority of files |
| `unit-node` | `unit-node` | Pure AI/rules/engines under `environment: 'node'` |
| `unit-isolated` | `unit-isolated` | Fresh module graph (`isolate: true`) — mocks / singletons / flake-prone timers |

```yaml
unit:
  timeout-minutes: 14
  strategy:
    fail-fast: false
    matrix:
      project: [unit-shared, unit-node, unit-isolated]
  steps:
    - # checkout persist-credentials: false + setup-node cache npm …
    - name: Run unit tests (${{ matrix.project }})
      timeout-minutes: 12
      run: npm run test:unit -- --project ${{ matrix.project }}
```

GitHub Actions check names expand to `unit (unit-shared)`, `unit (unit-node)`, `unit (unit-isolated)`. All three must pass for the matrix job to be green.

## Coverage parity with local `npm run test:unit`

| Surface | Command | Coverage |
| --- | --- | --- |
| Local / full suite | `npm run test:unit` | All three Vitest projects (unchanged) |
| CI shard | `npm run test:unit -- --project <name>` | One project per matrix cell |
| Local shard helpers | `npm run test:unit:shared` · `test:unit:node` · `test:unit:isolated` | Same filters as CI |

Union of the three CI shards == prior single-job `npm run test:unit` path set (same `vitest.config.ts` projects; no path exclude added).

## Budgets (unchanged ceilings)

| Knob | Value |
| --- | --- |
| Target wall (comment + step echo) | ~**8 min** per shard |
| Step timeout | **12m** (not raised) |
| Job timeout | **14m** (not raised) |
| Permissions | `contents: read` |
| Checkout | `persist-credentials: false` |
| apt / network in tests | forbidden (unchanged) |

## Live tip file count (measure before fold)

```bash
find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) \
  ! -path '*/_tokenmaxx_archive/*' | wc -l
```

Authoring tip `cursor/mp-tip-post700` @ fold `#700` measured **3131** files with that formula (ticket cited 3112; counts move as drafts fold).

## Related

- Vitest project lists: `vitest.config.ts` (`unit-shared` / `unit-node` / `unit-isolated`)
- Unit budget + AI-bench CI skips (docs): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md) (`q-mp-175`)
- Blocking vs report-only job map: [`docs/dev/ci-gates-mermaid-q-mp-073.md`](./ci-gates-mermaid-q-mp-073.md)
- Flake pressure under full-suite load: #642 (`ui-helper-dedupe` → `unit-isolated`)
