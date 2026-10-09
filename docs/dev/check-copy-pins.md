# check:copy-pins — player-facing copy pin detector

**Task id:** `q-mp-064` (helper) · `q-mp-137` (CI report-only step)  
**Posture:** report-only. Local default exits 0; CI lint job runs `npm run check:copy-pins -- --fail` with `continue-on-error: true` so findings surface in Actions without failing the blocking lint job.  
**Command:** `npm run check:copy-pins`

## Why this exists

Compliance reviews **7** ([#580](https://github.com/fuzzywigg/math-pentathlon/pull/580)) and **8** ([#583](https://github.com/fuzzywigg/math-pentathlon/pull/583)) had to drop tests that locked player-facing status/menu text before fold onto the tip after the alpha AI/copy restore. Known examples:

| Review | Pattern | Example (dropped before fold) |
| --- | --- | --- |
| 7 | `getPhaseMessage` empty-string pin | `expect(callaPhase(weird)).toBe('')` in engine-coverage round 2 |
| 7 | Exact menu badge copy | `expect(badge?.textContent).toBe('Coming Soon')` in ui-cov r3 game-selector |
| 8 | `getCurrentPhaseMessage` status regexes | `/green square/`, `/Place a Quadraphage/`, `/Player 1 wins/`, `/Tie/` in engine-coverage round 3 |

Those pins break (or freeze) restore surfaces when seat labels / status copy change. Prefer structural coverage instead.

## What it flags

Scans `tests/**/*.{test,spec}.{ts,tsx,js,mjs}` (skips `_tokenmaxx_archive`) for:

1. **message-api** — `expect(...getPhaseMessage(...)...)` / `getCurrentPhaseMessage` (including `import { getPhaseMessage as alias }`) with `toBe` / `toEqual` / `toStrictEqual` / `toMatch` / `toContain` (and `.not.` variants).
2. **coming-soon** — matcher args that pin the literal `"Coming Soon"` or `/Coming Soon/`.
3. **registry-string** — matcher args that pin distinctive string literals harvested from `getPhaseMessage` / `getCurrentPhaseMessage` bodies under `src/games/*/rules.ts` + `game-state.ts`, plus the menu badge string from `src/ui/game-selector.ts`.

## What it does **not** flag (false-positive guards)

- Badge / element **presence** (`expect(badge).toBeTruthy()`).
- `typeof getPhaseMessage(state) === 'string'` / `expect(typeof …).toBe('string')`.
- Fixture names / `it()` titles that merely mention “Coming Soon”.
- `.length` / emptiness probes without pinning message body text.
- CSS class / attribute structural asserts.

## Usage

```bash
npm run check:copy-pins              # scan tip tests/; always exit 0
npm run check:copy-pins -- --json    # machine-readable findings
npm run check:copy-pins -- --self-test   # prove review 7/8 examples + negatives
npm run check:copy-pins -- --fail    # opt-in exit 1 when findings (CI uses this + continue-on-error)
```

`--self-test` runs in-memory snippets that mirror the review 7/8 drops plus negative cases. It does **not** depend on those hunks still being present in `tests/`.

## Guidance for future drafts

| Prefer | Avoid |
| --- | --- |
| `expect(root.querySelector('.game-card-badge')).toBeTruthy()` | `expect(badge?.textContent).toBe('Coming Soon')` |
| `expect(state.turnPhase).toBe('placeQuadraphage')` | `expect(getCurrentPhaseMessage(state)).toMatch(/Place a Quadraphage/)` |
| `expect(typeof getPhaseMessage(state)).toBe('string')` | `expect(getPhaseMessage(state)).toBe('Blue wins!')` |
| Assert message **ids** / null select (owl helpers) | Assert player-visible body copy |

Hard rule reminder: no player-facing copy or rules-text product changes without owner approval. Characterization tests should pin **engine state / structure**, not chrome strings.

## Tip baseline note

The current tip still contains older suites that pin phase-message or “Coming Soon” text (pre-review burn/wave tests). On `cursor/mp-tip-post477` at land time of this helper, a typical scan reports on the order of ~190 findings (mostly `message-api`, plus a handful of `coming-soon` / `registry-string`). Those are **true positives** (legacy pins), not false positives — the self-test negatives (badge presence, `typeof` string checks, fixture names, `.length` probes, phase enums) stay clean.

`check:copy-pins` lists tip findings so new drafts do not add more. Clearing the baseline is optional tip-owner cleanup, not required for this helper to land.

## Acceptance proof (q-mp-064)

```bash
npm run check:copy-pins -- --self-test   # flags review 7/8 examples; negatives stay 0
npm run check:copy-pins                  # tip scan; exit 0 (report-only)
```
