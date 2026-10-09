# ESLint non-ceilinged residuals addendum (q-mp-240)

**Task id:** `q-mp-240`  
**Role:** worker (docs only)  
**Tip measured:** `cursor/mp-tip-post748` @ `ce673656` (`ce673656202db8a9eae4e3c404c55a680bb40cd0`)  
**Sibling of:** `docs/dev/eslint-off-rules-inventory.md` (open draft `#740` `q-mp-230` still owns a full inventory refresh — this file is **additive**, non-ceilinged focus only)

## Purpose

`docs/dev/lint-ratchet-ceilings.json` tracks ten count-down rules. Several high-signal residuals are **not** ceilinged yet. This addendum records live overlay counts on tip `post748` so workers can clear or ratchet them without guessing, and so tip owners know which buckets are hard-rule HOLD.

Docs only — no `eslint.config.js` / ceiling JSON / knip baseline edits in this task.

## Live tip ceilings (re-measure, for context)

```text
$ git rev-parse HEAD
  ce673656202db8a9eae4e3c404c55a680bb40cd0

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 254 / ceiling 254
  ok   @typescript-eslint/no-confusing-void-expression: 132 / ceiling 132
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 105 / ceiling 105
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 13 / ceiling 13
```

Ceilinged HOLD buckets (already in the main inventory / ratchet JSON — listed here so this addendum stays self-contained):

| Rule | Live = ceiling | HOLD note |
| --- | ---: | --- |
| `radix` | 6 | kwatro `ai.ts` (4) + `rules.ts` (2) — no AI / rules logic edits |
| `default-case` | 5 | fab/frac-fact `rules.ts` + fractions `arithmetic.ts` residual |
| `@typescript-eslint/prefer-optional-chain` | 21 | `*/rules.ts` + `*/ai.ts` only |
| `@typescript-eslint/prefer-nullish-coalescing` | 65 | densest residual `owl-messages`; open `#727` **HELD** — do not touch nullish |

## Overlay probe method

One-shot flat-config overlay over live `eslint.config.js` (same pattern as `scripts/check-lint-ratchet.mjs`), forcing only the four non-ceilinged rules as `error` on `src/`:

| Rule | Probe options |
| --- | --- |
| `no-console` | `'error'` (live unset / not in ratchet) |
| `no-param-reassign` | `'error'` (live unset) |
| `eqeqeq` | `['error', 'always']` — live is `always` with `null: 'ignore'` |
| `@typescript-eslint/return-await` | `['error', 'always']` (live unset) |

## Non-ceilinged totals (tip `ce673656`)

| Count | Rule | Clearable vs HOLD (this tip) | Related tickets / drafts |
| ----: | --- | --- | --- |
| **24** | `no-console` | ~1 demo `console.log` clearable; remainder intentional soft-fail keep-sites | open `#730` `q-mp-206` (post709; may add ratchet + keep-sites doc) |
| **23** | `no-param-reassign` | **11** clearable in `fractions/arithmetic.ts`; **12** HOLD (`*/ai.ts` + `fiar/rules.ts`) | prior `q-mp-195` / `q-mp-156` |
| **12** | `eqeqeq` (stricter, null not ignored) | **11** clearable outside rules; **1** HOLD `fiar/rules.ts` | prior `q-mp-194` / `q-mp-160` |
| **7** | `@typescript-eslint/return-await` (`always`) | **4** non-AI clearable (idle-warm 3 + mounts 1); **3** AI-client style (ticketed `q-mp-247`) | prior `q-mp-169` / `q-mp-193`; refill `q-mp-247` |

### Visual — residual share (non-ceilinged)

```text
no-console ████████████████████████  24
no-param   ███████████████████████   23
eqeqeq     ████████████              12
return-aw  ███████                    7
```

---

## `no-console` — 24

Live tip does **not** hard-enable or ratchet `no-console`. Soft-fail stderr paths dominate; treat as keep-sites unless a follow-up ratchet (`#730`) lands.

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/main.ts` | 10 | 68, 85, 217, 252, 280, 308, 336, 364, 392, 420 | keep — bootstrap / route soft-fail |
| `src/core/storage/storage.ts` | 7 | 90, 108, 120, 130, 140, 154, 168 | keep — storage soft-fail |
| `src/pwa/register.ts` | 2 | 79, 88 | keep — SW register soft-fail |
| `src/demos/expression-demo.ts` | 1 | 510 | clearable noise (`console.log`) — owned by open `#730` |
| `src/pwa/bootstrap-owl.ts` | 1 | 55 | keep — owl bootstrap soft-fail |
| `src/ui/game-error-boundary.ts` | 1 | 108 | keep — error-boundary soft-fail |
| `src/core/router.ts` | 1 | 12 | keep — router soft-fail |
| `src/games/kings-quadraphages/game-controller.ts` | 1 | 109 | review before strip — controller soft-fail |

**HOLD / keep rule of thumb:** preserve intentional `console.error` / `console.warn` soft-fail paths; only strip demo `console.log` noise when lowering a future ceiling.

---

## `no-param-reassign` — 23

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/core/fractions/arithmetic.ts` | 11 | 15–16, 20–21, 31–32, 54–55, 101, 627, 685 | clearable (non-AI) |
| `src/games/fiar/ai.ts` | 5 | 327, 607, 624, 658, 675 | **HOLD** — AI path |
| `src/games/calla/ai.ts` | 2 | 273, 295 | **HOLD** — AI path |
| `src/games/hex/ai.ts` | 2 | 220, 240 | **HOLD** — AI path (Hex Hard 450ms untouched) |
| `src/games/queens-guards/ai.ts` | 2 | 303, 323 | **HOLD** — AI path |
| `src/games/fiar/rules.ts` | 1 | 66 | **HOLD** — rules / legal-move path |

Clearable headroom if a ratchet is added later: **11** (arithmetic only). Do not invent a ceiling in this docs PR.

---

## Stricter `eqeqeq` (`always`, null not ignored) — 12

Live config already uses `eqeqeq: ['error', 'always', { null: 'ignore' }]`. Overlay drops the null ignore.

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/core/safe-web-storage.ts` | 3 | 54, 76, 148 | clearable |
| `src/ui/board-a11y.ts` | 2 | 508 (×2 on same line) | clearable |
| `src/ui/components/game-shell.ts` | 2 | 568, 570 | clearable |
| `src/ui/three/kwatro-sinko-board-3d.ts` | 2 | 619, 620 | clearable |
| `src/core/storage/storage.ts` | 1 | 66 | clearable |
| `src/games/kwatro-sinko/board-ui.ts` | 1 | 158 | clearable |
| `src/games/fiar/rules.ts` | 1 | 213 | **HOLD** — rules path |

Clearable headroom: **11**. HOLD residual: **1**.

---

## `@typescript-eslint/return-await` (`always`) — 7

| File | Hits | Lines | Disposition |
| --- | ---: | --- | --- |
| `src/pwa/idle-warm.ts` | 3 | 56, 67, 69 | clearable (prior `q-mp-169`) |
| `src/ui/game-route-mounts.ts` | 1 | 47 | clearable (prior `q-mp-193`) |
| `src/games/fab-a-diffy/ai-client.ts` | 1 | 46 | style-only on AI client — refill `q-mp-247` |
| `src/games/fiar/ai-client.ts` | 1 | 45 | style-only on AI client — refill `q-mp-247` |
| `src/games/queens-guards/ai-client.ts` | 1 | 46 | style-only on AI client — refill `q-mp-247` |

Non-AI clearable headroom: **4**. AI-client batch: **3** (no search/scoring/timing change — await style only).

---

## Open-draft coordination

| Draft | Topic | Relation to this addendum |
| --- | --- | --- |
| `#740` `q-mp-230` | full `eslint-off-rules-inventory.md` refresh | leave open; tip owner folds first; this sibling is additive |
| `#730` `q-mp-206` | demo `console.log` + optional `no-console` ratchet | owns keep-sites doc + ceiling add; do not duplicate |
| `#727` `q-mp-186` | nullish `owl-messages` | **HELD** — out of scope here |
| `#749`–`#753` | emit-identity / demos dup / demos void / dismissOwl / backlog | orthogonal |

No ratchet JSON or knip baseline change in this PR. If a later worker adds a ceiling for any of these four rules, tip owner takes **min** with any pending draft on that key.

## Acceptance

- [x] Tables match a re-run overlay probe on tip `ce673656`
- [x] HOLD buckets called out (AI / `rules.ts` / intentional soft-fail)
- [x] No `eslint.config.js` behavior change
- [x] Sibling path keeps `#740` non-conflicting

**Next action: fold into tip by the tip owner.**
