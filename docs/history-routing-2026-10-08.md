# History / navigation routing audit (burn-1008-mp-history-routing)

Live-tree audit of browser history, deep links, refresh, multi-tab, and PWA
standalone launch. Based on `cursor/integration-fold-wave5-tip-4af0`.

## Related drafts (not duplicated)

| PR | Topic | Overlap |
| --- | --- | --- |
| #480 | `destroyGame` / memory leak on remount | Lifecycle teardown only — not history stack |
| #458 | Offline / chunk-load retry | Load recovery keeps hash — not Back/Forward |
| #479 | WebKit offline soft-nav | Offline soft-nav — not history audit |
| #485 | Standalone-PR triage fold | Docs triage — not PWA standalone launch |

## Findings

| Route | Scenario | Issue | Fixed / reported |
| --- | --- | --- | --- |
| `/game/:id` (all 20) | Fast Back/Forward during lazy shell mount | Stale `mountGameShell` could `clearElement(#app)` after a newer route committed, then `initGame` + overwrite `currentCleanup` | **Fixed** — `mountGameShellForRoute` re-checks generation after await; clobber recovery remounts only when current gen has not re-committed |
| `#/unknown` | Direct unknown hash | Default `console.error` left previous view mounted | **Fixed** — `setNotFoundHandler(() => navigate('/'))` in `main.ts` |
| `/game/:id` (path, no hash) | Deep link under preview / CF Pages | `public/_redirects` had no SPA fallback (hash links were fine) | **Fixed** — `/* /index.html 200` in `_redirects` (after `/health`) |
| `/game/:id` | Hard refresh mid-game | In-memory board state lost | **Reported** — intentional; progress/settings persist in `localStorage`, boards do not |
| `/game/:id` × 2 tabs | Same game in two tabs | Independent mounts; shared progress blob only | **Reported** — no tab sync by design; e2e asserts both mount |
| Tutorial / Help / New Game | Browser Back | Modals/tutorial do not push history; Back leaves the game | **Reported** — intentional overlay UX (not a settings route) |
| PWA standalone | Launch via `start_url: '/'` | Always opens menu (no resume last game) | **Reported** — manifest intent; e2e covers menu launch + hash deep-link after |
| `/game/:id` | Listeners on Back | Shell `keydown` + game timers | Tip already wires `destroyGame` in cleanup; #480 deepens per-game teardown — not re-done here |

## Verification

See PR body for exact commands and results.
