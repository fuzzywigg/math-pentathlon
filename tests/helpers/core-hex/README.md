# core-hex (test-only)

Former `src/core/hex/{coordinates,hex-ui,types}.ts` lattice/UI helpers.

Production boards use `src/ui/hex-svg.ts` (and per-game board-ui). This package had
zero deep importers under `src/` and was moved here under `q-mp-133` so the app
graph no longer ships unused hex lattice code.

Import from unit suites as `../helpers/core-hex/{coordinates,hex-ui,types}`.
