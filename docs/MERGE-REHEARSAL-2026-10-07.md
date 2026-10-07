# Merge rehearsal — 2026-10-07 (ahead of Oct 9)

Docs-only rehearsal note. **No merges, closes, retargets, or pushes to existing PR branches from this inventory agent.** Confirmed tip: **#477** (`cursor/integration-fold-wave5-tip-4af0`).

Snapshot: 2026-10-07 later UTC · `alpha` @ `593270b` · tip = wave5 · open drafts classified below.

---

## ELI5 recommended path (fewest merges)

Think of the stack as **one tip pizza**. CI napkin **#435** (`cursor/**` PR triggers) is already folded into the wave-5 tip.

1. **Merge the wave-5 tip alone into `alpha`** — `cursor/integration-fold-wave5-tip-4af0` / draft **#477**. That lands the overnight / playability / test-infra fold chain **plus** `#435` CI triggers, flake-hunt, wiki, cross-browser report-only, memory cleanup, engine edges, etc.
2. **Close the contained / superseded drafts** (human; list below). Do **not** merge #413…#476 one-by-one unless you want a long review.
3. **Hold** the rules-adjacent inventory PRs listed below for Andrew.

**Merge count into `alpha` for the big land:** **1** (wave-5 tip alone).

---

## Exact ordered steps (Oct 9 window)

### Path A — preferred (1 merge)

| Step | Action | Result |
|------|--------|--------|
| 1 | Open/merge **one** tip→`alpha` PR from `cursor/integration-fold-wave5-tip-4af0` (#477) | Full stack + `#435` CI triggers land |
| 2 | Close superseded drafts (human; list below) | Housekeeping |
| 3 | Leave held-outs closed-or-open as Andrew decides | No auto-land |

`ci.yml` already combines tip jobs (`workflow_dispatch`, report-only `mobile-touch` / cross-browser / visual) with `#435`’s `pull_request` branches including `'cursor/**'`, `permissions: contents: read`, and `persist-credentials: false` on every checkout.

### Path B — layer-by-layer (not recommended)

Merge #435 → #413 → #438 → #440 → #444 → #447 → #449 → #454 → #466 → #476 → #477. Same end state as Path A, far more review surface / `ci.yml` conflict churn.

### Squash rehearsal

Squash tip → `alpha` should be **CLEAN** (tip already contains `alpha` + `#435` content). Prefer one tip PR (merge or squash) for Oct 9.

---

## Conflict notes

| Scenario | Conflicts | Notes |
|----------|-----------|-------|
| wave-5 tip → `alpha` | none expected | tip contains `alpha` lineage |
| Historical: #435 then #476 | `.github/workflows/ci.yml` only | Already resolved inside tip |
| Held-outs vs tip | semantic / file conflicts vary | Do not auto-land |

---

## Local test results (wave-5 tip)

| Check | Result |
|-------|--------|
| `npm run lint` | **pass** |
| `npx tsc --noEmit` | **pass** |
| `npm run test:unit` | **10919 passed** / 2 skipped (3047 files). Hex Hard `AI_PLAY_DEADLINE_MS` assert is **450** (aligned with #472). |
| Chromium + mobile e2e ×2 | **238 passed** each |
| Firefox + WebKit e2e ×1 (report-only path) | **358 passed**, 38 skipped |

---

## Draft PR classification

### Contained in wave-5 tip (close after tip → `alpha`)

Stack layers and leaves folded into tip (including wave-4 `#476` contents and wave-5 folds):

`#392` `#395`–`#413` `#415`–`#417` `#421`–`#427` `#430`–`#434` `#435` `#436`–`#440` `#442`–`#445` `#447` `#449` `#450` `#452` `#454`–`#458` `#464`–`#467` `#469` `#470` `#471` `#472` `#473` `#474` `#475` `#476` `#478` `#479` `#480` `#482` `#483` `#484` `#485` `#486`

Also close tip/intermediate fold PRs once tip is on `alpha`: **#477**, **#454**, **#466**, **#449**, **#447**, **#444**, **#440**, **#438**, **#413**.

### Standalone / held-out (do **not** auto-land with tip)

| PR | Notes |
|----|-------|
| **#393** / **#394** | Rules XOR (Andrew pick) |
| **#418** / **#419** / **#428** / **#429** | Held rules-adjacent deep playtests |
| **#441** | Docs / open rules questions (#355 Contig/FIAR/Hex Step-0 folded via #485) |
| **#414** / **#420** | Folded via #485 — close as superseded |
| **#451** | Prime-gold keyboard flake (if not fully in tip tree) |
| **#453** | Older inventory; tip has newer merge-order |
| **#459** / **#481** | Folded via #485 — close as superseded |
| **#468** AI retunes | **Needs owner decision** — harness folded; FIAR/Pent AI retunes NOT in tip |

---

## What this agent did / did not do

- Did: fold wave-5 candidates onto tip (including `#486` mobile-touch report-only), resolve CI/`hex` overlaps conservatively (kept tip security settings), update this rehearsal to **wave-5 tip alone → `alpha`**, run lint/tsc/unit/chromium e2e.
- Did **not**: merge/close/retarget any existing PR from the agent; change game rules or scoring; commit secrets.
