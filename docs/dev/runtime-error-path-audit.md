# Runtime error-path audit (burn-1008)

Task id: `burn-1008-mp-runtime-error-path-audit`

Tip SHA audited: `0dc1e953` (`cursor/integration-fold-wave5-tip-4af0`).

**Scope:** sites where a runtime error can leave a game unplayable without recovery — thrown handlers, uncaught promises (dynamic imports, SW registration, asset fetch, storage), mount/destroy / menu remount, WebGL context loss, JSON parse of saved state.

**Non-goals:** no `ai/` or rules/engine logic changes; no player-facing copy; this draft is **tests + this doc only** (zero `src/` edits).

## Overlap (skipped — already covered)

| Draft | Topic | Tip status | Skip scope |
| --- | --- | --- | --- |
| [#528](https://github.com/fuzzywigg/math-pentathlon/pull/528) | Storage failure modes (SecurityError, QuotaExceeded, cross-tab, non-JSON) | Folded (`safe-web-storage` live on tip) | `src/core/safe-web-storage.ts`, `storage.ts` load/save, flag wrappers; tests `safe-web-storage*.test.ts`, e2e `storage-blocked.spec.ts` |
| [#480](https://github.com/fuzzywigg/math-pentathlon/pull/480) | Memory leak / `destroyGame` wiring for menu remounts | Folded | Presence of `destroyGame` + route cleanup for all 20 games (not throw-safety of destroy) |
| [#479](https://github.com/fuzzywigg/math-pentathlon/pull/479) | Offline soft-nav / idle-warm shell+game imports | Folded | `idle-warm.ts` soft-fail on warm import reject; WebKit offline SPA soft-nav |

Adjacent gaps **not** covered by those drafts remain in the inventory below (e.g. `destroyGame` *throwing*, Prime Gold context-loss gap, owl bootstrap rejection).

## Behavior legend

| Label | Meaning |
| --- | --- |
| **recovered** | User can continue (crash UI, load-error + reload, 2D fallback, soft-fail) |
| **soft-fail** | App keeps running; feature degrades (offline, warm, progress defaults) |
| **UNRECOVERED** | Blank / stuck / stranded listeners with no in-app recovery path |

## Inventory

### 1. Shell / route / error boundary

| ID | file:line | Trigger | Current behavior | Blast | Tests |
| --- | --- | --- | --- | --- | --- |
| R-SHELL-01 | `src/main.ts:65-66` | `#app` missing at boot | **UNRECOVERED** — sync throw aborts bootstrap | shell | `runtime-error-path-audit.test.ts` (source pin + skip expected fix) |
| R-SHELL-02 | `src/main.ts` `cleanup()` / `onBeforeShow` | Route leave; `currentCleanup` throws | **recovered** — try/finally disposes boundary; cleanup failure logged; crash UI still proceeds | shell | audit suite P1 R-SHELL-02 |
| R-SHELL-03 | `src/main.ts:88-106` + `game-error-boundary.ts:87-144` | `window` `error` / `unhandledrejection` on game route | **recovered** — crash UI; `onBeforeShow` failures swallowed (`:99-103`) | one game | `game-error-boundary.test.ts`; audit suite pins swallow |
| R-SHELL-04 | `src/main.ts` `renderHome` | Throw / unhandled rejection on `/` | **recovered** — same `installGameErrorBoundary` / crash UI as game routes | shell | audit suite P2 R-SHELL-04 |
| R-SHELL-05 | `src/main.ts:168-203` | Dynamic import / `mountGameById` reject | **recovered** — `game-load-error` + `location.reload` retry | one game | `burn-1007-main-shell-routes.test.ts`; audit re-pins |
| R-SHELL-06 | `src/main.ts:123-140` / `:206-372` | Stats / demo chunk import fail | **recovered** — load-error UI | shell (page) | audit suite (stats reject) |
| R-SHELL-07 | `src/ui/game-route-mounts.ts:98-105` | `destroyGame()` throws inside cleanup | **UNRECOVERED** — `shell.cleanup()` skipped | shell | skip expected try/finally; CURRENT pattern pin |
| R-SHELL-08 | `src/ui/game-route-mounts.ts:172-181` (×20) | `init*Game` throws before `setGameRouteCleanup` | **partial** — outer catch shows load-error; shell listeners may leak | one game + shell | skip expected set-cleanup-before-init / finally |
| R-SHELL-09 | `src/ui/game-route-mounts.ts:63-71` | Stale shell wiped `#app` | **recovered** — microtask remount | one game | `burn-1007-game-route-mounts.test.ts` |

### 2. Event handlers

| ID | file:line | Trigger | Current behavior | Blast | Tests |
| --- | --- | --- | --- | --- | --- |
| R-EVT-01 | `game-shell.ts` Start / Tutorial / keydown | Handler throws while game route active | **recovered** via boundary | one game | boundary suite (window error path) |
| R-EVT-02 | `pointer-hygiene.ts` `bindPrimaryPointerActivate` | `activate()` throws | **recovered** via boundary | one game | boundary suite |
| R-EVT-03 | `game-selector.ts` menu card activate | Throw during navigate / render | **recovered** via home boundary (same as R-SHELL-04) | shell | audit suite P2 R-SHELL-04 |
| R-EVT-04 | `game-loading.ts:62-69` Retry | `location.reload()` | **recovered** (hard reload) | one game | `game-loading.test.ts` |

In-game handler throws are recovered by the per-route boundary; home/menu uses the same boundary (q-mp-107).

### 3. Promises / dynamic import / SW / fetch

| ID | file:line | Trigger | Current behavior | Blast | Tests |
| --- | --- | --- | --- | --- | --- |
| R-IMP-01 | `main.ts:171-184` | `import(game-route-mounts)` + play CSS fail | **recovered** — load-error | one game | `burn-1007-main-shell-routes.test.ts` |
| R-IMP-02 | `game-prefetch.ts:102-104` | Prefetch `import()` fail | **soft-fail** — clears `started`, retry later | none | source pin in audit suite (#479 adjacent; prefetch not idle-warm) |
| R-IMP-03 | `idle-warm.ts:102-123` | Shell/game warm import fail | **soft-fail** — SKIP (#479) | none | `burn-1007-pwa-shell-ui.test.ts`, `idle-warm-bootstrap-owl.test.ts` |
| R-IMP-04 | `bootstrap-owl.ts:37-44` | Owl chunk import / init rejects | **UNRECOVERED** on menu; can false-trigger game boundary | shell / one game | CURRENT unhandled pin + skip expected catch |
| R-SW-01 | `bootstrap.ts:40-42` → `register.ts:57` | `registerSW(...)` throws | **UNRECOVERED** throw from idle callback | shell (offline degrade) | CURRENT throw pin + skip expected guard |
| R-SW-02 | `register.ts:51-52` | SW unsupported / disabled | **soft-fail** — `{}` | shell | `pwa-register.test.ts` |
| R-SW-03 | `register.ts:74` | `registration.update()` rejects | **soft-fail** — `Promise.resolve(...).catch` + log | shell | fixed pin in audit suite + `pwa-register.test.ts` |
| R-FETCH-01 | App `src/` | Direct `fetch()` of game assets | None — Workbox owns cache | — | SKIP (#479 offline soft-nav) |

### 4. Mount / destroy / menu remount

| ID | file:line | Trigger | Current behavior | Blast | Tests |
| --- | --- | --- | --- | --- | --- |
| R-MT-01 | All `setGameRouteCleanup` | Normal leave | **recovered** — destroy + shell cleanup | one game | `burn-1007-game-route-mounts.test.ts`; wiring SKIP (#480) |
| R-MT-02 | Boundary `onBeforeShow` → cleanup | Crash UI | **soft-fail** if destroy throws — crash UI still shown | one game | `game-error-boundary.test.ts` + audit swallow pin |
| R-MT-03 | Controllers mid-3D-load | 3D chunk slow | Soft skip paint until ready; hang ⇒ blank board | one game | none for hang (not simulated) |

### 5. Canvas / WebGL context loss (3D)

| ID | Board | Notify | Controller | Behavior | Tests |
| --- | --- | --- | --- | --- | --- |
| R-GL-01 | `kings-quadraphages-board-3d.ts:265-269` | `mp3d-context-lost` | remount 2D | **recovered** | `mp3d-kings-board-3d-lifecycle.test.ts` |
| R-GL-02 | `queens-guards-board-3d.ts:400-404` | `mp3d-context-lost` | remount 2D | **recovered** | audit / lifecycle unavailable throw; context-lost pin in audit suite |
| R-GL-03 | `fiar-board-3d.ts:261-265` | `mp3d-context-lost` | remount 2D | **recovered** | `mp3d-fiar-board-3d-lifecycle.test.ts` |
| R-GL-04 | `kwatro-sinko-board-3d.ts:477-481` | `mp3d-context-lost` | remount 2D | **recovered** | `mp3d-kwatro-sinko-board-3d-lifecycle.test.ts` |
| R-GL-05 | `pent-em-in-board-3d.ts:311-316` | `mp3d-context-lost` | remount 2D | **recovered** | unavailable throw; pattern matches kings |
| R-GL-06 | `hex-a-gone-board-3d.ts:329-333` | `onWebglLost` callback | `fallBackTo2dBoard` | **recovered** | unavailable throw |
| R-GL-07 | `star-track-board-3d.ts:381-384` | `onContextLost` callback | `fallbackTo2dBoard` | **recovered** | unavailable throw |
| R-GL-08 | `prime-gold-board-3d.ts` | `mp3d-context-lost` | remount 2D | **recovered** | `mp3d-prime-gold-board-3d-lifecycle.test.ts` + board-select state preservation (#567) |

### 6. JSON.parse of saved state

| ID | file:line | Trigger | Current behavior | Blast | Tests |
| --- | --- | --- | --- | --- | --- |
| R-JSON-01 | `storage.ts` load via `safeParseJson` | Corrupt progress | **soft-fail** → defaults | shell progress | SKIP (#528); thin re-pin `safeParseJson` in audit suite |
| R-JSON-02 | `storage.ts` cross-tab | Peer non-JSON | **soft-fail** — keep memory | shell | SKIP (#528) |
| R-JSON-03 | `storage.ts:414-423` `importData` | Bad backup JSON | **soft-fail** → `false` | N/A (no UI caller) | `burn-wave*-storage-*.test.ts` |
| R-JSON-04 | `kings…/serialization.ts` `gameStateFromJSON` | Invalid JSON | **throws** — dormant (tests only) | one game if wired | skip harden-if-wired |

## Prioritized owner fix list

| Priority | IDs | Proposed fix (for tip owner — not in this PR) |
| --- | --- | --- |
| ~~**P0**~~ | ~~R-GL-08~~ | **Done in #567** — Prime Gold dispatches `mp3d-context-lost` and remounts playable 2D (kings/kwatro pattern) |
| ~~**P1**~~ | ~~R-SHELL-02~~ | **Done in q-mp-124** — `cleanup()` / `onBeforeShow` try/finally so `activeGameBoundary.dispose` always runs when `currentCleanup` throws |
| ~~**P1**~~ | ~~R-SHELL-07~~ | **Done in #568** — `setGameRouteCleanup` try/finally so `shell.cleanup` always runs |
| ~~**P1**~~ | ~~R-SHELL-08~~ | **Done in #568** — `initGameWithRouteCleanup` registers cleanup before init; rethrows original error |
| ~~**P2**~~ | ~~R-IMP-04~~ | **Done in #568** — `bootstrapOwl` try/catch + `console.error` |
| ~~**P2**~~ | ~~R-SHELL-04, R-EVT-03~~ | **Done in q-mp-107** — `renderHome` installs shared route error boundary (reuse crash UI strings) |
| ~~**P2**~~ | ~~R-SW-01~~ | **Done in #568** — `registerPwa` guards `registerSW` throw (soft-fail + log) |
| ~~**P2/P3**~~ | ~~R-SW-03~~ | **Done in q-mp-109** — `Promise.resolve(registration.update()).catch` + `console.error` |
| **P3** | R-SHELL-01 | Boot-time missing `#app` friendly fail (dev only) |
| **P3** | R-JSON-04 | Harden `gameStateFromJSON` if ever bound to UI |

## Verification (this draft)

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
git diff --name-only cursor/integration-fold-wave5-tip-4af0...HEAD
# expect: docs/dev/runtime-error-path-audit.md + tests/unit/* only
```

## Related test index

| Test file | Pins |
| --- | --- |
| `tests/unit/runtime-error-path-audit.test.ts` | Inventory pins; P0/P1/P2 fixed green; remaining P2/P3 skips |
| `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts` | R-GL-08 recovered: context-lost → `mp3d-context-lost` (+ board-select 2D fallback/state pin) |
| `tests/unit/game-error-boundary.test.ts` | Crash UI / window error / rejection |
| `tests/unit/burn-1007-main-shell-routes.test.ts` | Mount reject → load-error |
| `tests/unit/burn-1007-game-route-mounts.test.ts` | Mount/cleanup wiring + #568 P1 try/finally / init-throw cleanup |
| `tests/unit/pwa-register.test.ts` / `burn-1007-pwa-shell-ui.test.ts` | SW register / idle-warm (#479) |
| `tests/unit/safe-web-storage*.test.ts` | Storage failures (#528) |
