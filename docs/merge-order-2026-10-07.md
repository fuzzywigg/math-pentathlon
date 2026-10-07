# Merge order inventory — 2026-10-07

Docs-only map of **open draft PRs** (`#355`, `#392`–`#452`) against `alpha`, focused on the stacked playability / test-infra chain and what can close as superseded after the tip lands.

**Snapshot:** 2026-10-07 ~14:37 UTC · `alpha` @ `593270b` · **62** open drafts · **this agent does not merge, close, retarget, or push to any existing PR.**

**How status was gathered:** `gh pr list/view` (mergeability + check rollups) + `git merge-tree` probes vs `origin/alpha` and vs tip `cursor/a11y-tutorial-stack-446-448-05a3` (#449). Stacked PRs whose base is `cursor/**` show **NO_CI** until #435 lands (workflow `pull_request.branches` historically omitted `cursor/**`).

---

## 1. Recommended fewest merges (land everything)

### Path A — fewest GitHub merges into `alpha` (preferred)

| Step | Merge into `alpha` | Why |
|------|--------------------|-----|
| **1** | **#435** `ci: run lint/tsc/unit/e2e for PRs targeting cursor/**` | Unblocks real CI on every stacked draft still targeting `cursor/**`. Independent of game code. **Do this first.** |
| **2** | **Tip branch → `alpha` in one PR** | Tip content lives on `cursor/a11y-tutorial-stack-446-448-05a3` (#449). Prefer extending tip with **#451** (prime-gold keyboard flake) and **#450** (ramrod-deep flake) first, then open **one** tip→`alpha` PR (or retarget tip — human only; this inventory does not retarget). |
| **3** | **Held-out rules-adjacent (Andrew)** | After tip: land **exactly one** of **#393 XOR #394**, then **#418**, **#419**, **#428**, **#429** (order flexible; all merge-tree CLEAN vs tip today). |
| **4** | **Docs / side tracks** | **#355**, **#414**, **#420**, **#441**, **#442**, **#452** (and any leftover flake/docs not already in tip). Independent of the playability tip once #413-era base is on `alpha`. |

**Merge count (Path A):** **2** into `alpha` for CI + full playability/test/a11y tip (steps 1–2), then **~5–11** more for held-outs and docs depending how many Andrew approves and whether side tracks are batched.

### Path B — merge each stack layer in order (no tip retarget)

After **#435**:

1. **#413** → `alpha`
2. **#438** → `alpha` (GitHub usually auto-retargets children when the base PR merges)
3. **#440** → `alpha`
4. **#444** → `alpha`
5. **#447** → `alpha`
6. **#449** → `alpha`
7. Optionally **#451** → `alpha`; fold **#450** onto tip or merge separately

**Merge count (Path B):** **1 (#435) + 6 stack layers (+ optional flake PRs)** — same end state as Path A, more review surface.

### Do **not** merge (as individuals) once tip is on `alpha`

All leaf drafts whose **content** is already in the tip tree — see [§5 Superseded](#5-drafts-to-close-as-superseded-after-tip--alpha). Closing them is a human follow-up; this inventory does not close them.

---

## 2. Stack chain (on #413)

```
alpha
  └── #413  overnight polish integration          (base: alpha)
        ├── #438  deep-playtest playability stack   (#421–427, #430, #432–433 + #423)
        │     └── #440  deep-playtest stack-2         (#431, #434, #436, #437)
        │           └── #444  playability #415–#417
        │                 └── #447  test-infra #439+#443+#445
        │                       ├── #449  a11y+tutorial #446+#448   ← main tip
        │                       │     └── #451  prime-gold keyboard e2e flake
        │                       └── #450  ramrod-deep e2e flake (sibling of #449)
        └── (many leaves still based on #413 — see tables)
```

| Layer PR | Head branch | Commits ahead of `alpha` | Folds (content) |
|----------|-------------|--------------------------|-----------------|
| **#413** | `cursor/overnight-polish-integration-0494` | 59 | **#392**, **#395–#412** (19 leaves). Explicitly **skipped** #355 / #393 / #394. |
| **#438** | `cursor/deep-playtest-integration-48a7` | 100 | **#421–#427**, **#430**, **#432**, **#433**, **#423** |
| **#440** | `cursor/deep-playtest-stack-2-460b` | 113 | **#431**, **#434**, **#436**, **#437** |
| **#444** | `cursor/playability-stack-415-417-b354` | 122 | **#415**, **#416**, **#417** |
| **#447** | `cursor/test-infra-stack-439-443-445-6174` | 136 | **#439**, **#443**, **#445** |
| **#449** | `cursor/a11y-tutorial-stack-446-448-05a3` | 142 | **#446**, **#448** |
| **#451** | `cursor/prime-gold-keyboard-e2e-flake-2c2b` | 143 | Flake fix on top of #449 (not yet in #449 tip) |

**#393 note:** #413 history briefly merged then **reverted** #393 (`55b4212` Revert …). Tip **tree** matches contiguous path-scan (same as `alpha`); do **not** treat #393 as folded.

---

## 3. Held-out (rules-adjacent) — keep open for Andrew

These are **intentionally not** in #438 / #440 / #444 / #447 / #449. Integration PR bodies call them out.

| PR | Base | Topic | Why held |
|----|------|-------|----------|
| **#393** | `alpha` | Kwatro non-contiguous winning paths | Win-condition / scoring-adjacent; contradicts #394 lock tests; AGENTS.md escalate |
| **#394** | `alpha` | Kwatro Div II rules-lock tests (contiguous scan) | Locks opposite intent of #393; Andrew pick **XOR** |
| **#418** | #415 branch | Prime Gold Roll settle + FIAR move-phase touch | Excluded from #444; settle/end-condition questions |
| **#419** | #413 branch | Remainder Islands deep playtest | Excluded from #438/#440 (rules-adjacent stall/end) |
| **#428** | #413 branch | Juggle deep playtest (Pass jam / fit-aware) | Excluded; Pass / mutual-pass rules questions |
| **#429** | #413 branch | Hex-a-Gone deep playtest | Excluded from #438/#440 |

**#393 XOR #394:** both MERGEABLE vs `alpha` and merge-tree CLEAN vs tip, but **semantic conflict** on `findWinningAlignment` (gaps allowed vs stop-at-empty) plus competing tests/docs. Land at most one after Andrew’s call; see also docs PR **#441**.

Related (not “held-out” of the stack, but rules/docs context): **#355** (mp3d Step-0 rules questions), **#441** (consolidated rules questions).

---

## 4. Full open-draft inventory

Legend — **CI:** GitHub check rollup. `OK(n)` = all non-skipped conclusions SUCCESS. `NO_CI` = empty rollup (typical for `cursor/**` bases until #435). **vs α:** GitHub `mergeable` + `mergeStateStatus` against the PR’s *declared* base (for `alpha`-based PRs this is vs `alpha`). Local `git merge-tree` vs `origin/alpha` was **CLEAN** for #413 tip, #449 tip, #435, held-outs, #355, #414.

### 4a. Directly on `alpha`

| PR | Title (short) | Mergeable | CI | Folded into tip? |
|----|---------------|-----------|-----|------------------|
| #355 | docs(mp3d) Step-0 specs | MERGEABLE / UNSTABLE | FAIL `audit` | No — docs hold |
| #392 | tablet/offline playability | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #393 | Kwatro non-contiguous paths | MERGEABLE / CLEAN | OK(5) | **No — held / reverted off #413** |
| #394 | Kwatro rules-lock tests | MERGEABLE / CLEAN | OK(5) | **No — held** |
| #395 | perf offline/lazy shell | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #396 | contig-60 / FIAR polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #397 | hex-a-gone / QG / kings polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #398 | RI / Sum Dominoes polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #399 | PWA tablet icons | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #400 | offline Hex AI e2e keeper | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #401 | stars/par/ramrod AI lock | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #402 | fab-a-diffy Hard AI worker | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #403 | frac-fact / pent AI lock | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #404 | Oct 5 Hard AI regression guards | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #405 | prime-gold AI lock | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #406 | calla / fraction-pinball polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #407 | juggle AI-seat polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #408 | shell/menu a11y keepers | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #409 | kings AI-seat aria | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #410 | FIAR AI-seat aria | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #411 | hex 44px + reduced-motion | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| #412 | star-track AI-seat polish | MERGEABLE / CLEAN | OK(5) | Yes → #413 |
| **#413** | **overnight polish integration** | MERGEABLE / CLEAN | OK(5) | Stack base |
| #414 | playtest report 2026-10-07 | MERGEABLE / UNSTABLE | FAIL `unit` (`kwatro-sinko-end-rules-375`) | No — docs; flake unrelated to report files |
| **#435** | **CI for `cursor/**` PR bases** | MERGEABLE / CLEAN | OK(5) | No — merge **first**, separately |

### 4b. Based on #413 (`cursor/overnight-polish-integration-0494`)

| PR | Title (short) | Folded? | Notes |
|----|---------------|---------|-------|
| #415 | playtest recheck fixes | Yes → #444 | |
| #419 | Remainder Islands deep | **Held** | |
| #420 | gallery screenshots | No | Docs/assets side track |
| #421 | Sum Dominoes deep | Yes → #438 | |
| #422 | Fab-a-Diffy deep | Yes → #438 | |
| #423 | perf bundle / play CSS split | Yes → #438 | Downstream CSS ports assume this |
| #424 | Fraction Pinball deep | Yes → #438 | |
| #425 | Contig 60 deep | Yes → #438 | |
| #426 | Kings deep | Yes → #438 | |
| #427 | Queens & Guards deep | Yes → #438 | |
| #428 | Juggle deep | **Held** | |
| #429 | Hex-a-Gone deep | **Held** | |
| #430 | Calla deep | Yes → #438 | |
| #431 | Ramrod deep | Yes → #440 | |
| #432 | Stars & Bars deep | Yes → #438 | |
| #433 | Par 55 deep | Yes → #438 | |
| #434 | Hex deep | Yes → #440 | |
| #436 | Star Track deep | Yes → #440 | |
| #437 | axe a11y sweep | Yes → #440 | |
| **#438** | **deep-playtest integration** | Stack layer | |
| #439 | cross-browser smoke | Yes → #447 | |
| #441 | rules questions doc | No | Docs for Andrew |
| #442 | unit flake hunt | No | Test infra side track |
| #443 | 3D e2e timeouts | Yes → #447 | |
| #445 | visual regression suite | Yes → #447 | |
| #446 | tutorial clarity | Yes → #449 | |
| #448 | keyboard/SR a11y | Yes → #449 | |
| #452 | engine invariant coverage | No | Test side track |

All of the above: GitHub **MERGEABLE / CLEAN** vs declared base; **NO_CI** (empty rollup).

### 4c. Stacked on #415 / mid-chain / tip

| PR | Base | Folded? | Notes |
|----|------|---------|-------|
| #416 | #415 | Yes → #444 | Kwatro AI thrash (heuristics only) |
| #417 | #415 | Yes → #444 | Pent place UX |
| #418 | #415 | **Held** | Prime Gold settle + FIAR |
| **#440** | #438 | Stack layer | |
| **#444** | #440 | Stack layer | |
| **#447** | #444 | Stack layer | |
| **#449** | #447 | **Main tip** | |
| #450 | #447 | Not in tip yet | Sibling flake fix — fold before tip→α if possible |
| #451 | #449 | Tip+1 | Prime-gold keyboard flake — preferred tip head |

---

## 5. Drafts to close as superseded after tip → `alpha`

After Path A step 2 (tip branch on `alpha`), these drafts’ **content is already present** and can be closed as superseded (human action):

### Leaf drafts

`#392`, `#395`, `#396`, `#397`, `#398`, `#399`, `#400`, `#401`, `#402`, `#403`, `#404`, `#405`, `#406`, `#407`, `#408`, `#409`, `#410`, `#411`, `#412`, `#415`, `#416`, `#417`, `#421`, `#422`, `#423`, `#424`, `#425`, `#426`, `#427`, `#430`, `#431`, `#432`, `#433`, `#434`, `#436`, `#437`, `#439`, `#443`, `#445`, `#446`, `#448`

### Intermediate integration PRs (if tip landed as one unit)

`#413`, `#438`, `#440`, `#444`, `#447`, `#449` (and `#451` / `#450` if included in that tip merge)

**Count:** ~**40** leaf + **6** stack PRs (≈46) closable as superseded once tip is on `alpha`.

### Keep open (not superseded by tip)

| PR | Reason |
|----|--------|
| #355 | Docs / open rules questions |
| #393, #394 | Held rules XOR |
| #414 | Playtest report (docs); also CI unit red on unrelated kwatro flake |
| #418, #419, #428, #429 | Held rules-adjacent |
| #420 | Gallery screenshots not in tip |
| #435 | Merged separately in step 1 (or still open until then) |
| #441 | Rules-questions checklist |
| #442 | Flake-hunt suite not in tip |
| #450 | Only superseded if folded into tip before merge |
| #452 | Engine coverage suite not in tip |

---

## 6. Conflicts vs `alpha` (summary)

| Subject | Result |
|---------|--------|
| All listed drafts (GitHub `mergeable`) | **MERGEABLE** |
| `alpha`-based green playability / #413 / #435 | **CLEAN** + CI OK |
| #355 | MERGEABLE / **UNSTABLE** (audit FAIL) — no file conflict |
| #414 | MERGEABLE / **UNSTABLE** (unit FAIL) — no file conflict |
| Tip #449 / #451 vs `alpha` (`merge-tree`) | **CLEAN** |
| Held-outs vs tip #449 (`merge-tree`) | **CLEAN** (still review for semantic/rules overlap) |
| #393 vs #394 | **Semantic conflict** (path-scan + tests); not both |

No draft in this inventory is currently `CONFLICTING` against its base or against tip in the merge-tree probes run for this snapshot.

---

## 7. CI status pattern

| Cohort | CI today |
|--------|----------|
| Drafts targeting **`alpha`** (except #355, #414) | **Green** (5 checks) |
| **#435** | **Green** — merge first so the next cohort gets checks |
| Drafts targeting **`cursor/**`** | **NO_CI** until #435 is on `alpha` (and PRs re-run) |
| **#355** | `audit` FAIL; build/e2e skipped |
| **#414** | `unit` FAIL (`tests/unit/kwatro-sinko-end-rules-375.test.ts` chip-id expectation) — docs PR; failure is pre-existing suite flake on `alpha` lineage, not the report files |

Local verification claimed on integration PR bodies (#413 / #438 / #440 / #444 / #447 / #449): lint / `tsc` / unit / chromium e2e green at authoring time — **not** re-proven by GitHub Actions until #435 + re-run.

---

## 8. Quick reference — what each stack PR claims to include / exclude

| PR | Includes | Explicitly excludes |
|----|----------|---------------------|
| #413 | #392, #395–#412 | #355, #393, #394 |
| #438 | #421–#427, #430, #432–#433 (+ #423) | #419, #428, #429 |
| #440 | #431, #434, #436, #437 | #419, #428, #429, #418 |
| #444 | #415, #416, #417 | #418, #419, #428, #429, #393, #394 |
| #447 | #439, #443, #445 | (no rules holds; test infra only) |
| #449 | #446, #448 | (no rules holds) |

---

## 9. Operator checklist (human)

1. Merge **#435** → `alpha`; confirm a stacked draft re-runs lint/unit/e2e.
2. Optionally merge **#450** + **#451** onto tip (or cherry-pick) so tip absorbs both flake fixes.
3. Land tip → `alpha` via Path A (one tip PR) or Path B (six layer merges).
4. Close superseded drafts listed in §5.
5. Andrew: answer **#441** / **#355**; choose **#393 XOR #394**; then schedule **#418 / #419 / #428 / #429**.
6. Land remaining docs/test side tracks (#414 after unit flake understood, #420, #442, #452).

---

*Generated for draft PR inventory only. No merges, closes, retargets, or pushes to existing PR branches were performed while writing this document.*
