# Engineering backlog — 2026-10-10aa (tip refill after post1059 mid-fold / round-27)

**Task id:** `q-mp-090aa`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1059` @ `8d7be822` (full `8d7be822794d7d472058708825799ac423fac2e8`)  
**Depends on:** tip cut after `q-mp-026r` / tip PR #1059 squash-merged; tip-owner fold `q-mp-026s` / draft tip PR `#1083` (base `alpha`) advancing live tip HEAD. Round-26 backlog (`q-mp-090z` / draft `#1114`, ids `q-mp-717`…`721`) is **not** tip-carried yet — leave with `contained`. Round-25 (`q-mp-090y` / tip-carried `10y` + workers `#1084`–`#1113` / `#1115`) continues into post1059. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1059` @ `8d7be822` measures suite **3356** files / **14242** cases (`unit-shared` **13037** / `unit-node` **380** / `unit-isolated` **825**); nnnull **237**/237; void **47**/47; nullish **65**/65; unusedTypes live **29** vs baseline **36**; AGENTS + wiki tip **name** already **post1059**; wiki/testing-layers **count** cells still stale (owned by open `#1098`/`667`+`668` — leave with `contained`). Fresh `CI=1 npm run test:unit:coverage` @ tip tree yields statements **98.33%** / branches **95.80%** / lines **98.69%**. **eqeqeq live probe 0 / ceiling 1** headroom — **do not** clear product `==` in `*/rules.ts`; round-18 `543` already owns the ceiling drop. This doc lists **8 new** concrete engineering tasks (`q-mp-742` … `q-mp-749`) mined from the **live tip tree** @ `8d7be822`, checked against prior refills (`q-mp-090` … `q-mp-090z` / ids through `q-mp-721`) and against the full open draft PR list. It is the **only** deliverable of `q-mp-090aa`.

**Honest count:** Only **8** tasks — not padded to 25. After tip folds + open `#1099`/`10y` + `#1114`/`10z` residual closes, a **full-suite** `test:unit:coverage` pass shows nearly every previously cold non-rules module at **≥98%** lines (or already owned by rounds ≤26 / open drafts). Knip unusedExports remain the intentional LEAVE barrel pair + AI `cancelFabAiRequests` (no SAFE deletes). Rank-3 unusedTypes headroom is still only `alignment/compat.ts` ×7 with no batch demote headroom per prior knip disposition. This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **branch-gap** tickets, demo coverage, harness shards, remasure/count-stamp inventories, tip-name/count theater, `*types*` residuals, or anything in rounds ≤26. Payoffs are freshly measured: **lint ratchet-DOWN** successors after `#1114`/`719`–`721` (one key each), **docs that disagree with live tip narrative** (ceilings notes leftover), **e2e fixed-wait hygiene** with asserts preserved, and **one shared test fixture** extraction.

**Preference:** SAFE, mutually independent **tests-only** or **docs-only** work. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket, copy-pins, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer sweep theater, open-draft triage, emit-identity, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps (`#1098` owns `667`/`668`). **Avoid** competing tickets already owned by open `#1084`–`#1115` / tip-carried `10x`/`10w`/`10v` / undrafted lint clears (`465`/`564`/`543`/`623`/`245`/`727`/…). Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** pursue optional-chain / radix / return-await **product** clears (`*/rules.ts` / `*/ai.ts` / `*/ai-client.ts`). **Do not** pursue eqeqeq product clears (ceiling drop stays with undrafted `#995`/`543`).

**Lint policy for this refill:** ratchets only go down; **at most one new task per ceiling key** in this doc. Keys already claimed by an open draft or undrafted prior-owner (`void` open `#1114`/`719` prime-gold-board-3d + `#1099`/`694` pent + tip-carried `#1082`/`669` kwatro + undrafted `#1058`/`623` fiar + `#1041`/`601` star-track + `#1020`/`579` hex-a-gone + tip-carried `#1075`/`649` kings + `465` prime-gold/types + main HOLD, `nnnull` open `#1114`/`720` owl-system + `#1099`/`695` compat + tip-carried `#1082`/`670` owl-component + tip-carried `#1075`/`650` dice-selector + undrafted `#1058`/`624` attributes/types + `#1009`/`564` roller + undrafted `545`/`499`/`466`/`449`/`407`/`396`/`367`/`345`/`283`, `nullish` open `#1114`/`721` juggle/board-ui + `#1099`/`696` owl-component + tip-carried `#1082`/`671` tutorial + tip-carried `#1075`/`651` placement + undrafted `#1058`/`625` dice-ui + `#1041`/`603` dice-demo + `#1020`/`581` attribute-demo + `#1009`/`565` board-a11y + `#971`/`529` graph-ui + `#955`/`509` contiguous + `#934`/`480` settings-flags + `#727` owl-messages + undrafted `245` controllers, `dup-imports` `346`/`#827`, `eqeqeq` `#995`/`543`, `return-await` `316`/`247`, `switch` `266`, `default-case` `246`, `optional-chain` `#982` HOLD, `no-shadow` `319`) get **no** competing same-key clears except the **sole** new owners named below (`void` → `queens-guards-board-3d` after `#1114`/`719`, `nnnull` → `owl-messages` after `#1114`/`720`, `nullish` → `fiar-board-3d` after `#1114`/`721`).

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-721`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family                                                                                                                                                                                                                                                | Why skipped                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| round-26 backlog / alpha knip inventory 717 / testing-layers H2 718 / void prime-board-3d / nnnull owl-system / nullish juggle | open `#1114` `10z` + worker `#1115`/`717` — leave with `contained`; **do not** re-queue |
| round-25 backlog / knip mermaid 692 / coverage-map tip 693 / void pent / nnnull compat / nullish owl-component / fiar layout + kings renderer/state / queens\|ramrod\|star\|prime\|contig types / tablet-gl / soft-fail navigate 706 / mutation-ui-timeout fake timers 707 | tip-carried `10y` + workers `#1084`–`#1113` — leave with `contained`; **do not** re-queue |
| per-game UI coverage rounds / soft-fail characterizations / mutation-audit waves / board-3d **branch-gap** tickets / demo coverage items / harness shards / remasure inventories / residual top-ups on modules already **>90%** both metrics with miss&lt;2 | prompt hard-skip for round-27 |
| queens-guards/game-controller **85.7%** lines residual (missL=39)                                                                                                                                                                                             | prior UI coverage rounds 24/39/52 already claimed that surface — **do not** re-queue as another UI-cov round |
| knip unusedExports (storage barrel LEAVE + `cancelFabAiRequests` AI) / Rank-3 compat ×7 demote / unusedTypes baseline 36→29 drop                                                                                                                           | intentional LEAVE / prior demote chain / remasure theater — leave alone |
| AGENTS + wiki tip **name** → post1059                                                                                                                                                                                                                       | already correct on live tip @ `8d7be822` (count cells still stale → `#1098`/`667`) |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts logic / copy / scoring / optional-chain or radix **product** clears / CI permissions **widening**                                                                                                       | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `8d7be822`)

| Id                                  | Title (short)                | Verdict                                                | Evidence @ `8d7be822`                                                                                 |
| ----------------------------------- | ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `q-mp-090z` / `#1114`               | round-26 backlog 10z         | **still-valid (open)**                                 | Leave open with `contained` — this refill starts after `721`.                                         |
| `q-mp-717` / `#1115`                | alpha-required-checks knip   | **still-valid (open)**                                 | Job inventory still omits `knip` until `#1115` folds — leave with `contained`.                        |
| `q-mp-718` / `#1114`                | testing-layers H2 post1023   | **still-valid (open)**                                 | H2 still reads `post1023 tip-owner remasure` @ `aa4386b4` — leave `#1114` alone.                      |
| `q-mp-667`–`668` / `#1098`          | wiki/testing-layers counts   | **still-valid (open)**                                 | Live **3356**/ **14242** vs docs **3341**/ **14072**; leave `#1098` — **do not** re-queue count stamps. |
| `q-mp-719`–`721` / `#1114`          | void prime / nnnull owl-system / nullish juggle | **still-valid → successors `742`–`744`** | Overlay densest successors named below. |
| `q-mp-543` / `#995`                 | eqeqeq ceiling 1→0           | **still-valid (HOLD product; ceiling-only undrafted)** | Probe buckets **0**/1; **do not** re-queue.                                                           |
| `q-mp-465`                          | void prime-gold/types (−1)   | **still-valid (undrafted)**                            | Overlay types void **1**; leave alone — not this refill’s void owner.                                 |

## Shared-file conflict flags

| Shared file                           | Conflicting new ids                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/dev/lint-ratchet-ceilings.json` | `q-mp-742` (void HOLD-CHECK), `q-mp-743` (nnnull), `q-mp-744` (nullish HOLD-CHECK) — one key each; tip owner takes **min**; `745` may touch **notes** prose only (no ceiling number edits) |
| `src/core/owl/owl-messages.ts`        | `743` nnnull clear (+ undrafted `#727` nullish −9 HOLD + open `#1068`/`644` residual lines) — serialize; `!` / brace only; **no** copy string edits |
| `src/ui/three/queens-guards-board-3d.ts` | `742` void clear (+ open `#1057`/`615` branch tests) — serialize; no layout product beyond void brace |
| `src/ui/three/fiar-board-3d.ts`       | `744` nullish clear (+ undrafted `#1058`/`623` void −4 + open `#1052`/`611` branch tests) — serialize; `??` only |

**Parallel-friendly (no ratchet JSON):** `q-mp-745`–`q-mp-749` (ceiling keys only on `742`–`744`).

## Live tip measurements (evidence snapshot @ `8d7be822`)

```text
$ git rev-parse HEAD
  8d7be822794d7d472058708825799ac423fac2e8

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 237 / ceiling 237
  ok   @typescript-eslint/no-confusing-void-expression: 47 / ceiling 47
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 42 / ceiling 42
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 3 / ceiling 3
  ok   eqeqeq: 1 / ceiling 1
  ok   @typescript-eslint/return-await: 3 / ceiling 3

$ npm run report:lint-buckets -- --rule eqeqeq
  eqeqeq: 0 / ceiling 1 (−1 headroom; lower the ceiling after cleanup)
  (no hits)   ← ceiling drop stays with undrafted #995/543; no product == clear

$ npm run report:lint-buckets (densest excerpts)
  void densest: main 12 HOLD / hex-a-gone-board-3d 5 (#1020/579) /
                star-track-board-3d 5 (#1041/601) / fiar-board-3d 4 (#1058/623) /
                kings|kwatro|pent|prime|queens board-3d 4 each /
                prime-gold/types 1 (465)
  nnnull densest clearable non-rules: mounts 28 (deferred HOLD) /
                expression-ui 7 (396) / grid-alignment 5 (367) / transform 5 (345) /
                evaluator 14 (283) / placement 3 (449) / roller 2 (#1009/564) /
                … / owl-system 1 (#1114/720) / owl-messages 1 (this refill) /
                compat 1 (#1099/695) / owl-component 1 (#1082/670)
  nullish densest: owl-messages 9 (#727 HOLD) / dice-selector 5 (308) /
                owl-events 5 (333) / … / juggle/board-ui 1 (#1114/721) /
                fiar-board-3d 1 (this refill) / other board-3d 1 each

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216   ← AI residual (hard-rule HOLD)

$ npm run report:knip
  unusedExports: 3  unusedTypes: 29  unlisted: 3  duplicates: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36)
  unusedExports = storage barrel LEAVE (isPlainProgressObject, sanitizeSettings)
                  + cancelFabAiRequests (AI HOLD) — no SAFE deletes

$ CI=1 npm run test:unit:coverage
  Statements 98.33% (24587/25004)  Branches 95.80% (12219/12754)
  Functions  98.05% (3327/3393)    Lines    98.69% (23596/23907)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3356

$ npx vitest list | wc -l
  14242
  → unit-shared 13037 / unit-node 380 / unit-isolated 825

$ docs/dev/lint-ratchet-ceilings.json notes
  still "Tip post1023 min ceilings …"  ← disagrees with live tip post1059

$ docs/dev/testing-layers-2026-10-09.md
  H2 still post1023 @ aa4386b4  ← owned by #1114/718

$ docs/dev/alpha-required-checks-q-mp-056.md
  report-only inventory still omits knip  ← owned by #1115/717
```

Open drafts into `cursor/mp-tip-post1059` at audit: `#1084`–`#1115` (coverage/docs/lint workers) + tip-fold `#1083` on `alpha`. No open draft owns backlog `10aa` / ids `742`–`749`.

---

## Tasks

### q-mp-742 · Clear `no-confusing-void-expression` in `queens-guards-board-3d.ts` (−4) — [HOLD-CHECK: board-3d UI chrome / layout-adjacent]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold of open `#1114` `q-mp-719` preferred; leave `#1099`/`694` pent + `#1082`/`669` kwatro + `#1058`/`623` fiar + `#1041`/`601` star-track + `#1020`/`579` hex-a-gone + tip-carried `#1075`/`649` kings + undrafted `465` prime-gold/types alone (**sole** void-ceiling task in this refill)
- **series:** lint-void
- **verdict:** **HOLD-CHECK** — board-3d src is never SAFE per hard rules; brace-only clear preferred, but 3D layout adjacency requires tip-owner guardrail before product pass
- **target files:** `src/ui/three/queens-guards-board-3d.ts`, `docs/dev/lint-ratchet-ceilings.json` (void key only, down by 4)
- **measured baseline:** Ratchet probe: `queens-guards-board-3d.ts` **4** void hits (L341/L457/L463/L797); tip void live **47**/47; densest remaining board-3d void host after prime (`#1114`/`719`) / pent (`#1099`/`694`) / kwatro / kings / fiar / star-track / hex-a-gone.
- **acceptance criteria:** File clean under the rule **or** documented HOLD if layout risk; void ceiling down by **4** only on proven behavior-neutral brace clear; related queens / board-3d unit suites green; no board-3d layout product / camera / geometry edits beyond void brace; no AI/rules/copy edits; no network in tests.
- **verification commands:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*queens* tests/unit/*board-3d*`
- **conflict notes:** void key only used here in this refill; serialize with `#1114`/`719` / older board-3d void chain / `465` / open `#1057`/`615` branch tests; tip owner min-wins.

### q-mp-743 · Clear `no-non-null-assertion` in `owl-messages.ts` (−1)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold of open `#1114` `q-mp-720` preferred; leave undrafted `#1058`/`624` attributes/types + `#1009`/`564` roller + tip-carried `#1082`/`670` owl-component + `#1075`/`650` dice-selector + `545`/`499`/`466`/`449`/`407`/`396`/`367`/`345`/`283` alone — **sole** nnnull-ceiling task in this refill
- **series:** lint-nnnull
- **verdict:** **SAFE** — brace/`?.` style clear at `selectMessage` pool index (`L532` `finalPool[…]!`); **do not** edit player-facing message `text` strings or the `#727` nullish `||` formatMessage sites
- **target files:** `src/core/owl/owl-messages.ts`, `docs/dev/lint-ratchet-ceilings.json` (nnnull key only, down by 1)
- **measured baseline:** Ratchet probe nnnull `owl-messages.ts` **1** (L532); tip nnnull **237**/237; densest clearable non-rules/non-scoring host after owl-system (`#1114`/`720`) / compat (`#1099`/`695`) / owl-component (`#1082`/`670`) chain. Skip `main`/`mounts`/`*/rules.ts`/`evaluator`/`timer-scoring` HOLD densest. Undrafted `#727` owns **nullish** (−9) on this file, not nnnull.
- **acceptance criteria:** File clean under the nnnull rule; nnnull ceiling down by **1**; related owl unit suites green; **no** player-facing copy / aria / label edits; no AI/rules/scoring edits; no network in tests.
- **verification commands:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*owl*`
- **conflict notes:** nnnull key only used here in this refill; serialize with `#1114`/`720` + open `#1068`/`644` owl-messages residual lines + undrafted `#727` nullish; tip owner min-wins.

### q-mp-744 · Clear `prefer-nullish-coalescing` in `fiar-board-3d.ts` (−1) — [HOLD-CHECK: board-3d UI chrome / layout-adjacent]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold of open `#1114` `q-mp-721` preferred; leave `#727` / `308` / `333` / … / `#1099`/`696` owl-component / undrafted `245` controllers alone (**sole** nullish-ceiling task in this refill)
- **series:** lint-nullish
- **verdict:** **HOLD-CHECK** — board-3d src is never SAFE per hard rules; `??` only with tip-owner guardrail; **no** copy / aria / label / glyph string edits; serialize with undrafted `#1058`/`623` void clear on the same file
- **target files:** `src/ui/three/fiar-board-3d.ts`, `docs/dev/lint-ratchet-ceilings.json` (nullish key only, down by 1)
- **measured baseline:** Ratchet probe nullish `fiar-board-3d.ts` **1** (L111); tip nullish **65**/65; densest clearable non-HOLD host after juggle (`#1114`/`721`) that is **not** already owned by `#727` owl-messages / `#1020`/`581` attribute-demo / `#1009`/`565` board-a11y / `#971`/`529` graph-ui / `#955`/`509` contiguous / `#934`/`480` settings-flags / undrafted `245` controllers. Sibling board-3d nullish singles (hex/kings/kwatro/pent/queens/prime/tablet-gl) **not** claimed here.
- **acceptance criteria:** File clean under the rule **or** documented HOLD if layout risk; nullish ceiling down by **1** only on proven behavior-neutral `??` clear; related fiar / board-3d unit suites green; no board-3d layout product beyond nullish; no AI/rules/copy edits; no network in tests.
- **verification commands:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*fiar* tests/unit/*board-3d*`
- **conflict notes:** nullish key only used here; serialize with `#1114`/`721` + undrafted `#1058`/`623` void + open `#1052`/`611` branch tests; tip owner min-wins.

### q-mp-745 · Docs: fix lint-ratchet ceilings notes tip leftover (**post1023** → **post1059**)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with any open ceiling-number edits on the same JSON — this ticket owns **notes prose** only; **do not** change rule ceiling integers unless a lint clear already landed)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; ceilings `notes` field **demonstrably disagrees** with live tip name `cursor/mp-tip-post1059` (ceiling integers still match live ratchet probe)
- **target files:** `docs/dev/lint-ratchet-ceilings.json` (`notes` string only: `Tip post1023` → `Tip post1059`; keep the historical clear citations)
- **measured baseline:** Live tip HEAD `8d7be822` / branch `cursor/mp-tip-post1059`; `lint-ratchet-ceilings.json` notes still read `Tip post1023 min ceilings (q-mp-026r + …)`.
- **acceptance criteria:** Notes tip name matches live tip `post1059`; ceiling integers unchanged by this ticket (or only lowered by a separate lint-clear fold); `npm run lint:ratchet` still passes; no `src/` / CI permissions edits.
- **verification commands:** `git rev-parse HEAD` ; `rg -n 'post1023|post1059' docs/dev/lint-ratchet-ceilings.json` ; `npm run lint:ratchet`
- **conflict notes:** serialize with `742`–`744` ceiling-number edits (tip owner min-wins on numbers; this ticket is notes-only); leave `#1114`/`718` testing-layers H2 alone; no remasure of ceiling values.

### q-mp-746 · E2E: replace fixed `waitForTimeout` in `canvas-dpr-resize` with condition waits (keep asserts + test counts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave older `#764`/`258` canvas-dpr audit alone with `contained`)
- **series:** e2e-hygiene
- **verdict:** **SAFE** — tests-only harness harden; keep behavioral asserts and test counts; no board-3d / AI / copy edits
- **target files:** `tests/e2e/canvas-dpr-resize.spec.ts` (four `page.waitForTimeout(50|100)` sites after viewport flips); no `src/` edits
- **measured baseline:** Live file has `waitForTimeout(100)` @ L107/L156 and `waitForTimeout(50)` @ L128/L130 after `setViewportSize` before click/status asserts. Chromium e2e list still **25** files / **249** cases (`npm run test:e2e:chromium -- --list`).
- **acceptance criteria:** Fixed sleeps replaced with `expect` / locator / `waitForFunction` condition waits (or equivalent) that preserve the same placement/status asserts; `it(` / test counts unchanged; targeted Chromium project green under `CI=1`; no `src/` / visual-baseline / AI-timing edits; no network beyond local app under test.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/canvas-dpr-resize.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/canvas-dpr-resize.spec.ts` ; `npm run test:e2e:chromium -- --list` (case count stable)
- **conflict notes:** leave `#764`/`258` audit + board-3d `mp3d-*` wait sites alone (`contained`); no ratchet JSON.

### q-mp-747 · E2E: replace fixed `waitForTimeout` in `contig-60-playability` human-turn helper (keep asserts + test counts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **SAFE** — tests-only harness harden in Chromium playability helper; keep roll/place/pass asserts and test counts; **no** AI timing / Hex Hard / scoring edits
- **target files:** `tests/e2e/contig-60-playability.spec.ts` (`humanTurn` helper `waitForTimeout(100)` @ L23 before valid/pass branch); no `src/` edits
- **measured baseline:** Helper sleeps 100ms then branches on `.contig-cell-valid` count / pass visibility / expr option. Spec is Chromium-only (`test.skip` other browsers).
- **acceptance criteria:** Fixed sleep replaced with a condition wait for valid cell **or** pass **or** expr option (same branch structure); asserts + test counts preserved; suite green under `CI=1` Chromium; no `src/` / AI / copy edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/contig-60-playability.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/contig-60-playability.spec.ts` ; `rg -c '^\s*test\(' tests/e2e/contig-60-playability.spec.ts`
- **conflict notes:** leave `sum-dominoes-deep` / `queens-guards-playability` / `mp3d-*` wait sites alone (separate surfaces); no ratchet JSON; **not** a fullgame harness shard.

### q-mp-748 · Tests: extract shared soft-fail / residual `router.navigate` mock helper (keep asserts + test counts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with open `#1105`/`706` navigate de-flake on `454`/`598` — adopt helper **after** or **with** those asserts retargeted; do not re-introduce navigate-call races)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only fixture extraction; keep behavioral asserts and test counts; no soft-fail re-characterization of product gaps
- **target files:** new helper under `tests/helpers/` or `tests/unit/helpers/` (e.g. shared `vi.mock` factory / navigate spy helpers); adopt in a **small** first wave of soft-fail / residual suites that already duplicate `vi.mock('../../src/core/router', …)` (prefer `q-mp-353` / `q-mp-549` / post-`706` `454`/`598` once folded); no `src/` edits
- **measured baseline:** Tip has ≥10 unit files with near-identical `vi.mock('../../src/core/router', () => ({ navigate: vi.fn(), … }))` blocks (`q-mp-353`, `q-mp-549`, `q-mp-598`, demo residual suites, mounts residuals). Open `#1105`/`706` owns navigate **assert** de-flake on `454`/`598` only — not fixture extraction.
- **acceptance criteria:** Shared helper exists and is used by ≥3 former duplicate call sites; asserts + `npx vitest list | wc -l` unchanged (or explained); targeted suites green under `CI=1`; no `src/` / copy pins / AI edits; leave `#1082`/`686` demo navigate de-flake alone with `contained`.
- **verification commands:** `rg -n "vi.mock\\('.*/router" tests/unit --glob 'q-mp-*.ts' | wc -l` ; `CI=1 npx vitest run --project unit-shared tests/unit/q-mp-353-game-route-mounts-soft-fail.test.ts tests/unit/q-mp-549-game-route-mounts-soft-fail-residuals.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** serialize with `#1105`/`706`; leave soft-fail **characterization** drafts alone (`contained`); no ratchet JSON; **not** a harness shard of burn/overnight files.

### q-mp-749 · Tests: replace fixed `waitForTimeout` in `sum-dominoes-deep` settle helpers (keep asserts + test counts) — [HOLD-CHECK: deep vs-AI playtest]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — deep vs-AI playtest can touch think/status timing chrome; replace sleeps with condition waits only under tip-owner guardrail; **do not** loosen AI timing asserts or Hex Hard
- **target files:** `tests/e2e/sum-dominoes-deep.spec.ts` (`waitForTimeout(100|120|80)` sites); no `src/` edits
- **measured baseline:** Three fixed sleeps remain in the Chromium deep playtest helper/flow (L34/L84/L116). Spec is part of required Chromium e2e set (not `@fullgame` harness shard).
- **acceptance criteria:** Fixed sleeps replaced with condition waits preserving the same finish/status/touch asserts; test counts unchanged; suite green under `CI=1` Chromium; no `src/` / AI deadline / scoring edits; no network beyond local app under test.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/sum-dominoes-deep.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/sum-dominoes-deep.spec.ts`
- **conflict notes:** leave `canvas-dpr` (`746`) / `contig-60-playability` (`747`) / `mp3d-*` / fullgame harness waits alone; no ratchet JSON.

---

## Id allocation

New ids in this doc: **`q-mp-742` … `q-mp-749`** (**8** tasks — fewer than 25; no filler).  
Ids `q-mp-722`…`q-mp-741` are intentionally unused in this refill (gap after round-26 `717`…`721`).  
Do **not** reuse `q-mp-001`–`q-mp-721`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1059`.

**Ceiling keys used once each in this refill:** void `742` (HOLD-CHECK), nnnull `743`, nullish `744` (HOLD-CHECK).  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** eqeqeq ceiling (`#995`/`543`), optional-chain product clears (`#982`/`510` HOLD), knip demote batch / unusedTypes baseline drop (Rank-3 still only `compat.ts` ×7), wiki count remasure theater (`#1098`/`667`–`668`), alpha knip inventory / testing-layers H2 (`#1115`/`717`, `#1114`/`718`), UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **branch-gap** tickets (void/nullish lint clears `742`/`744` are the only board-3d-adjacent items and are HOLD-CHECK), harness shards, demo coverage, residual top-ups on modules already **>90%** on both metrics with miss&lt;2, `*types*` residuals (`700`–`704`), void pent/kwatro/kings/fiar/star-track/hex-a-gone/prime/main, nnnull owl-system/compat/owl-component/dice-selector/…, nullish juggle/owl-component/tutorial/placement/…/controllers `245`, open post1059 workers `#1084`–`#1115`.

Prefer parallel start on no-ratchet ids: **745–749** (ceiling keys only on **742–744**).

**One-line id tags:** `742 HOLD-CHECK`, `743 SAFE`, `744 HOLD-CHECK`, `745 SAFE`, `746 SAFE`, `747 SAFE`, `748 SAFE`, `749 HOLD-CHECK`.

**Next action: fold into tip by the tip owner.**
