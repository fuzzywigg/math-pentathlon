# q-mp-307 — stats-dashboard soft-fail / empty-state residuals

Tests-only characterization for `src/ui/stats-dashboard.ts` on tip post755.

## Scope

- New suite: `tests/unit/q-mp-307-stats-dashboard-residuals.test.ts`
- Soft-fail: `formatLastPlayed` catch when `toLocaleDateString` throws
- Empty-state structure (`role="status"`, no summary/list) without new copy pins
- Residuals: empty `profile.name`, `bestStreak === 0` omit, achievements summary
  item count, clearElement re-render, zero-`gamesPlayed` row path
- No `src/` edits; no AI, scoring, rules, or player-facing copy changes

## Coverage note

Statement/branch/function/line coverage for `src/ui/stats-dashboard.ts` was
already **100%** when including `burn-1008-ui-cov-r3-shell-menu` (catch) plus
mutation-ui3 / burn-wave stats suites. This task locks residual **behavioral**
arms with structural asserts under an owned suite (backlog: prefer arms not
already locked by mutation-ui3 / burn-wave).

| File                        | Metric           | Before (stats-named suites only) | After (+ q-mp-307) |
| --------------------------- | ---------------- | -------------------------------- | ------------------ |
| `src/ui/stats-dashboard.ts` | lines / branches | 99.34% / 100% (catch uncovered)  | **100% / 100%**    |

“Before” uses the verify glob `tests/unit/*stats*` (excludes shell-menu catch).
q-mp-307 owns that soft-fail arm in the stats residual suite.

## Verify

```bash
npx vitest run tests/unit/*stats*
npm run lint
npm run typecheck
npm run lint:ratchet
npm run test:unit
```
