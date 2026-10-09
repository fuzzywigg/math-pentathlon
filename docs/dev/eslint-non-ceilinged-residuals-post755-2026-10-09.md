# ESLint non-ceilinged residuals refresh (q-mp-315)

**Task id:** `q-mp-315`  
**Role:** worker (docs only)  
**Tip measured:** `cursor/mp-tip-post755` @ `dab1ac97` (`dab1ac9784f9b6d9fc39fb010100f6e8a86433c0`)  
**Supersedes stamp of:** [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) (`q-mp-240` on tip `post748` @ `ce673656`) — leave open draft `#759` with **contained** (tip already has that file; this is the post755 remeasure)  
**Sibling of:** [`eslint-off-rules-inventory.md`](./eslint-off-rules-inventory.md) (open `#740` still owns a full inventory refresh)

## Purpose

`docs/dev/lint-ratchet-ceilings.json` still tracks ten count-down rules. Four high-signal residuals remain **non-ceilinged**. This refresh re-runs the overlay on tip `post755` after tip `q-mp-268` cleared idle-warm + mounts `return-await` (**7 → 3**). Ceiling introductions for `return-await` / `no-console` are **not** this ticket (`q-mp-316` / `q-mp-317`).

Docs only — no `eslint.config.js` / ceiling JSON / knip baseline / `src/` edits.

## Live tip ceilings (context)

```text
$ git rev-parse HEAD
  dab1ac9784f9b6d9fc39fb010100f6e8a86433c0

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 246 / ceiling 246
  ok   @typescript-eslint/no-confusing-void-expression: 86 / ceiling 86
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 78 / ceiling 78
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 9 / ceiling 9
```

Ceilinged HOLD buckets (unchanged policy; not re-probed here):

| Rule | Live = ceiling | HOLD note |
| --- | ---: | --- |
| `radix` | 6 | kwatro `ai.ts` + `rules.ts` — no AI / rules logic edits |
| `default-case` | 5 | fab/frac-fact `rules.ts` + fractions `arithmetic.ts` residual |
| `@typescript-eslint/prefer-optional-chain` | 21 | `*/rules.ts` + `*/ai.ts` only |
| `@typescript-eslint/prefer-nullish-coalescing` | 65 | densest residual `owl-messages`; open `#727` **HELD** |

## Overlay probe method

One-shot flat-config overlay over live `eslint.config.js` (same pattern as `scripts/check-lint-ratchet.mjs`), forcing only the four non-ceilinged rules as `error` on `src/`:

| Rule | Probe options |
| --- | --- |
| `no-console` | `'error'` (live unset / not in ratchet) |
| `no-param-reassign` | `'error'` (live unset) |
| `eqeqeq` | `['error', 'always']` — live is `always` with `null: 'ignore'` |
| `@typescript-eslint/return-await` | `['error', 'always']` (live unset) |

## Before → after (non-ceilinged totals)

| Rule | post748 (`ce673656`, `q-mp-240`) | post755 (`dab1ac97`, this refresh) | Δ |
| --- | ---: | ---: | ---: |
| `no-console` | 24 | **24** | 0 |
| `no-param-reassign` | 23 | **23** | 0 |
| `eqeqeq` (stricter) | 12 | **12** | 0 |
| `@typescript-eslint/return-await` | 7 | **3** | **−4** (tip `q-mp-268` idle-warm + mounts) |

### Visual — residual share (non-ceilinged @ `dab1ac97`)

```text
no-console ████████████████████████  24
no-param   ███████████████████████   23
eqeqeq     ████████████              12
return-aw  ███                        3
```

---

## `no-console` — 24

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/main.ts` | 10 | 68, 85, 217, 252, 280, 308, 336, 364, 392, 420 | keep — bootstrap / route soft-fail |
| `src/core/storage/storage.ts` | 7 | 91, 109, 121, 131, 141, 155, 169 | keep — storage soft-fail |
| `src/pwa/register.ts` | 2 | 79, 88 | keep — SW register soft-fail |
| `src/demos/expression-demo.ts` | 1 | 510 | clearable noise (`console.log`) — optional with `q-mp-317` |
| `src/pwa/bootstrap-owl.ts` | 1 | 55 | keep — owl bootstrap soft-fail |
| `src/ui/game-error-boundary.ts` | 1 | 108 | keep — error-boundary soft-fail |
| `src/core/router.ts` | 1 | 12 | keep — router soft-fail |
| `src/games/kings-quadraphages/game-controller.ts` | 1 | 109 | review before strip — controller soft-fail |

**Not AI / rules / scoring.** Intentional soft-fail `console.error` / `console.warn` keep-sites dominate. Ceiling intro is `q-mp-317` (sole `no-console` key).

---

## `no-param-reassign` — 23

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/core/fractions/arithmetic.ts` | 11 | 15–16, 20–21, 31–32, 54–55, 101, 627, 685 | clearable (non-AI) — backlog `q-mp-318` |
| `src/games/fiar/ai.ts` | 5 | 327, 607, 624, 658, 675 | **HOLD** — AI path (hard rules) |
| `src/games/calla/ai.ts` | 2 | 273, 295 | **HOLD** — AI path |
| `src/games/hex/ai.ts` | 2 | 220, 240 | **HOLD** — AI path (Hex Hard **450ms** untouched) |
| `src/games/queens-guards/ai.ts` | 2 | 303, 323 | **HOLD** — AI path |
| `src/games/fiar/rules.ts` | 1 | 66 | **HOLD** — rules / legal-move path |

Clearable headroom: **11** (arithmetic only). HOLD in AI/rules: **12**. Not fixable under hard rules for the HOLD rows.

---

## Stricter `eqeqeq` (`always`, null not ignored) — 12

Live config already uses `eqeqeq: ['error', 'always', { null: 'ignore' }]`. Overlay drops the null ignore.

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/core/safe-web-storage.ts` | 3 | 54, 76, 148 | clearable — open `#800` `q-mp-194` |
| `src/ui/board-a11y.ts` | 2 | 508 (×2 on same line) | clearable — open `#800` |
| `src/ui/components/game-shell.ts` | 2 | 568, 570 | clearable — open `#800` |
| `src/ui/three/kwatro-sinko-board-3d.ts` | 2 | 619, 620 | clearable — open `#800` |
| `src/core/storage/storage.ts` | 1 | 67 | clearable — open `#800` |
| `src/games/kwatro-sinko/board-ui.ts` | 1 | 160 | clearable — open `#800` |
| `src/games/fiar/rules.ts` | 1 | 213 | **HOLD** — rules path |

Clearable headroom: **11**. HOLD residual: **1** (`rules.ts` — not fixable under hard rules). Prefer fold `#800` over duplicating clears.

---

## `@typescript-eslint/return-await` (`always`) — 3

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/games/fab-a-diffy/ai-client.ts` | 1 | 46 | AI-client style only — undrafted `q-mp-247`; ceiling intro `q-mp-316` |
| `src/games/fiar/ai-client.ts` | 1 | 45 | AI-client style only |
| `src/games/queens-guards/ai-client.ts` | 1 | 46 | AI-client style only |

**Δ vs post748:** idle-warm (3) + `game-route-mounts` (1) cleared on tip via `q-mp-268` / open `#786` lineage. Remaining **3** are all under `*/ai-client.ts` (flagged AI-surface; style-only await — no search/scoring/timing change if cleared later). Ceiling intro is sole key `q-mp-316` at **3**.

---

## Open-draft coordination

| Draft | Topic | Relation |
| --- | --- | --- |
| `#759` `q-mp-240` | post748 non-ceilinged addendum (file on tip) | leave open; **contained** by tip + this refresh |
| `#740` `q-mp-230` | full `eslint-off-rules-inventory.md` refresh | leave open; tip owner folds; this sibling is additive |
| `#800` `q-mp-194` | clear stricter eqeqeq outside `rules.ts` | owns the 11 clearable eqeqeq hits |
| `#786` `q-mp-268` | return-await idle+mounts (−4) | already reflected in tip totals (3 left) |
| `#796` `q-mp-280` | lint-bucket report script | ceilinged buckets helper; orthogonal |
| `#727` `q-mp-186` | nullish `owl-messages` | **HELD** — out of scope |
| backlog `q-mp-316` / `q-mp-317` | ceiling intros for return-await / no-console | do **not** edit ceilings in this docs PR |
| backlog `q-mp-318` | clear no-param in arithmetic (−11) | clearable arithmetic only |

No ratchet JSON or knip baseline change in this PR. Ratchets only go down; one agent per lint ceiling key.

## Acceptance

- [x] Overlay re-run on tip `post755` @ `dab1ac97`
- [x] Totals + bar visual; return-await **7 → 3** recorded
- [x] AI / `rules.ts` / scoring-path HOLD rows flagged
- [x] Docs only under `docs/dev/`; no product / ceiling edits
- [x] Hex Hard assert stays **450ms**

**Next action: fold into tip by the tip owner.**
