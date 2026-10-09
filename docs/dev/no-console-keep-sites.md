# Intentional `no-console` keep-sites (q-mp-206)

Live tip probe before this task: **24** `no-console` hits under `src/`.
After deleting the demo `console.log` in `src/demos/expression-demo.ts`, residual count is **23**.

These structured soft-fail logs are **intentional**. Do **not** strip them when lowering the `no-console` ceiling via `npm run lint:ratchet` — replace demo/`console.log` noise only.

## Keep (soft-fail diagnostics)

| Area               | File                            | Role                                                                               |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| **main**           | `src/main.ts`                   | Missing `#app`, route cleanup failures, lazy game/demo load errors                 |
| **storage**        | `src/core/storage/storage.ts`   | Corrupt/blocked progress load (`console.warn`) and save failures (`console.error`) |
| **register**       | `src/pwa/register.ts`           | Service-worker registration / update-check soft-fail                               |
| **error-boundary** | `src/ui/game-error-boundary.ts` | Per-game crash boundary report before recovery UI                                  |

## Other residual hits (also keep unless a follow-up task says otherwise)

| File                                              | Notes                             |
| ------------------------------------------------- | --------------------------------- |
| `src/pwa/bootstrap-owl.ts`                        | Owl bootstrap soft-fail           |
| `src/core/router.ts`                              | Unknown-route diagnostic          |
| `src/games/kings-quadraphages/game-controller.ts` | Uninitialized container soft-fail |

Ratchet: `no-console` in `docs/dev/lint-ratchet-ceilings.json` (live `eslint.config.js` stays unset; count-down only). Related audit: `docs/dev/runtime-error-path-audit.md`.
