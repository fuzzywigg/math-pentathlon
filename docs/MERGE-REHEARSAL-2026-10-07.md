# Merge rehearsal — 2026-10-07 (ahead of Oct 9)

Docs-only local dress rehearsal. **No merges, closes, retargets, or pushes to existing branches were done.** Confirmed tip for this note: **#476** (`cursor/integration-fold-wave4-tip-36e4`). Wave-5 tip **#477** is in progress on top.

Snapshot: 2026-10-07 ~17:40 UTC · `alpha` @ `593270b` · tip @ `367d291` · 92 open drafts.

---

## ELI5 recommended path (fewest merges)

Think of the stack as one big pizza (#476) plus a tiny CI napkin (#435).

1. **Merge #435 into `alpha` first** — turns CI on for stacked `cursor/**` PRs. One file; clean.
2. **Merge the #476 tip into `alpha` once** (squash or merge). That lands the whole overnight / playability / test-infra fold chain. **Do not** merge #413…#466 one-by-one unless you want a long review.
3. **Hand-edit `.github/workflows/ci.yml` once** when combining #435 + tip: keep tip’s jobs/`workflow_dispatch`, and keep #435’s `pull_request` branches including `'cursor/**'`, `permissions: contents: read`, and `persist-credentials: false`. That is the **only** conflict in the short path.
4. **Hold** the rules-adjacent / inventory PRs listed below. Fold **#477** later (or wait for it) if you want wave-5 extras before Oct 9.

**Merge count into `alpha` for the big land:** **2** (#435 + tip), plus one small CI conflict resolution.

---

## Exact ordered steps (Oct 9 window)

### Path A — preferred (2 merges)

| Step | Action | Result |
|------|--------|--------|
| 1 | Merge **#435** → `alpha` | CI triggers for `cursor/**` bases |
| 2 | Open/merge **one** tip→`alpha` PR from `cursor/integration-fold-wave4-tip-36e4` (#476) | Full stack lands |
| 2a | Resolve **only** `.github/workflows/ci.yml` as above | Keep tip CI features + #435 cursor triggers |
| 3 | Close superseded drafts (human; list below) | Housekeeping |
| 4 | Leave held-outs closed-or-open as Andrew decides | No auto-land |
| 5 | Optional: finish **#477** then tip→`alpha` instead of #476 if wave-5 is ready | Adds flake-hunt / wiki / cross-browser / etc. |

### Path B — layer-by-layer (rehearsed locally; not recommended)

After #435: merge #413 → #438 → #440 → #444 → #447 → #449 → #454 → #466 → #476.

- Clean through **#444**.
- From **#447** onward: same **`ci.yml`** conflict with #435 already on the branch.
- End state matches Path A after resolving CI the same way.

### Squash rehearsal

`git merge --squash origin/cursor/integration-fold-wave4-tip-36e4` onto plain `alpha`: **CLEAN**. Resulting tree **identical** to tip. Squash onto `alpha`+#435: same single `ci.yml` conflict as Path A step 2a.

---

## Conflict notes

| Scenario | Conflicts | Notes |
|----------|-----------|-------|
| #435 → `alpha` | none | |
| tip → `alpha` | none | tip already contains `alpha` |
| #435 then tip (or tip then #435) | **`.github/workflows/ci.yml` only** | Combine both intents (see Path A) |
| Stepwise #447+# after #435 | same `ci.yml` | Abort/retry until tip; don’t fight intermediates |
| Squash tip → `alpha` | none | Prefer this or a single merge PR for tip |

---

## Local test results (scratch tree = `alpha` + #435 + tip, CI resolved)

Run in `/tmp/merge-rehearsal-2026-10-07/final` @ `61bf8e8` (scratch only).

| Check | Result |
|-------|--------|
| `npm run lint` | **pass** |
| `npx tsc --noEmit` | **pass** |
| `npm run test:unit` | **1 fail** / 10875 pass / 3 skip (3046 files). Fail: `tests/unit/hex-deep-playability.test.ts` still expects Hard `AI_PLAY_DEADLINE_MS` **2500**; tip code from #472 uses **450**. **#477 already has the expectation fix.** |
| Chromium e2e (CI shape): `--project=chromium --project=mobile-iphone-se --project=mobile-pixel-7` | **238 passed** |

**Oct 9 implication:** landing raw #476 tip will fail unit CI on that hex deadline keeper unless you also take the wave-5 test fix (or land #477 tip instead).

---

## Draft PR classification (92 open)

Legend: **in #476** = tip already has the change (patch/ancestry content on tip tree). **→#477** = on/planned for wave-5 tip. **held-out** = keep separate. **standalone** = not in either tip.

### Contained in #476 tip (close after tip → `alpha`)

Stack layers and leaves folded into tip (63 by tip ancestry, including folds named in #476):

`#392` `#395`–`#413` `#415`–`#417` `#421`–`#427` `#430`–`#434` `#436`–`#440` `#442`–`#445` `#447` `#449` `#454`–`#458` `#460`–`#467` `#469` `#470` `#472` `#473`

Also already folded by content (even though some appear on older “held-out” lists): **`#450`**, **`#452`**. Tutorial/a11y stack heads **`#446`**, **`#448`** are in tip lineage (later tip edits may differ on a few files — treat as superseded).

Also close as superseded once tip lands: **#476** itself (and intermediate tip PRs **#454** **#466** **#470** if still open).

### Will be contained by #477 (wave-5, in progress)

| PR | Status on #477 head today |
|----|---------------------------|
| **#469** | Already in **#476** tip (skip re-fold) |
| **#471** | Merged into #477 |
| **#474** | Merged into #477 |
| **#475** | Merged into #477 |
| **#478** | Merged into #477 |
| **#479** | On #477 lineage (WebKit offline PWA) |
| **#480** | On #477 lineage (memory-leak / destroyGame) |

When #477 is the tip you land instead of #476, close the above plus **#476** and **#477**.

### Standalone / held-out

User hold-list (do **not** auto-land with tip). Clean apply onto #476 tip = merge rehearsal only:

| PR | In tip by patch? | Applies clean on #476 tip? | Notes |
|----|------------------|----------------------------|-------|
| **#393** | no (rules/tutorial differ) | **yes** | Rules-adjacent; XOR with #394 |
| **#394** | no | **no** — `tutorial.ts`, `main.ts` | Rules-lock tests |
| **#418** | no | **yes** | Prime Gold / FIAR playability |
| **#419** | no | **yes** | Remainder Islands deep |
| **#428** | no | **no** — juggle `board-ui` / `game-controller` / `rules` | Juggle deep |
| **#429** | no | **no** — `src/style.css` | Hex-a-gone deep |
| **#441** | no | **yes** | Rules/scoring questions doc |
| **#446** | mostly superseded in tip | **yes** | Prefer tip; don’t re-merge |
| **#448** | mostly superseded in tip | **yes** | Prefer tip; don’t re-merge |
| **#450** | **yes** | n/a | Already in tip — close as superseded |
| **#451** | no | **yes** | Prime-gold keyboard flake (not fully in tip) |
| **#452** | **yes** | n/a | Already in tip — close as superseded |
| **#453** | no | **no** — `docs/merge-order-2026-10-07.md` | Older inventory; tip has newer merge-order |

### Other standalone (not in #476 / #477)

| PR | Clean on #476 tip? |
|----|--------------------|
| **#355** docs mp3d | yes |
| **#414** playtest report | yes |
| **#420** gallery screenshots | yes |
| **#459** hex-a-gone engine coverage | yes |
| **#468** AI calibration matrices | **no** — `kwatro-sinko/ai.ts` |
| **#481** unit flake hunt | yes |
| **#482** engine edge-case suite | yes |

Special: **#435** = CI-first (not in tip). **#476** = confirmed tip. **#477** = wave-5 tip in progress.

---

## After tip lands — close these (human)

Close as superseded (content in #476 tip): the contained list above, plus tip/intermediate fold PRs **#454 #466 #470 #476** (and **#449 #447 #444 #440 #438 #413** once tip is on `alpha`).

**Do not close** held-outs still intentionally open: **#393 #394 #418 #419 #428 #429 #441 #451 #453** (and any of #446/#448 you still want as discussion artifacts — content already in tip).

---

## What this agent did / did not do

- Did: local scratch merges, squash tip onto `alpha`, classify drafts, run lint/tsc/unit/chromium e2e, write this doc in a **new** branch off the tip.
- Did **not**: merge/close/retarget/push any existing PR branch; change game rules or scoring; commit secrets.
