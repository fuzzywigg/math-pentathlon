/**
 * Usage strings for browser harness CLIs that share parseBrowserHarnessArgs
 * (q-mp-1061). Kept free of Playwright so unit tests can import hermetically.
 */

export const CONSOLE_SWEEP_USAGE = `Usage: node scripts/console-sweep.mjs

One-off Playwright console sweep across available games.
Writes JSON to SWEEP_OUT when set; otherwise <artifact-dir>/console-sweep-raw.json
(artifact-dir: /opt/cursor/artifacts when creatable, else test-results/agent-artifacts).

Options:
  -h, --help       Show this help and exit (no browser launch)

Env:
  BASE_URL         Dev server URL (default http://127.0.0.1:5173)
  SWEEP_OUT        Output JSON path (overrides artifact-dir default)
  MP_ARTIFACT_DIR  Artifact root override when SWEEP_OUT is unset`;

export const NAV_AWAY_SWEEP_USAGE = `Usage: node scripts/nav-away-sweep.mjs

Navigate-away sweep against a running dev server (default http://127.0.0.1:5173).
Launches Playwright Chromium and walks the fixed game list.

Options:
  -h, --help       Show this help and exit (no browser launch)

Env:
  BASE_URL         Dev server URL (default http://127.0.0.1:5173)`;

export const MEMORY_LEAK_AUDIT_USAGE = `Usage: node scripts/memory-leak-audit.mjs

Memory-leak audit (Playwright + CDP heap snapshots) for available games.
Prefer: npm run audit:memory

Options:
  -h, --help       Show this help and exit (no browser launch)

Env:
  MEM_LEAK_LABEL / MEM_LEAK_GAMES / MEM_LEAK_CYCLES / MEM_LEAK_PORT
  MEM_LEAK_BASE_URL / MEM_LEAK_DATE`;

export const RUNTIME_PERF_USAGE = `Usage: node scripts/runtime-perf.mjs

Report-only runtime perf harness (Playwright + CDP).
Prefer: npm run perf:runtime

Options:
  -h, --help       Show this help and exit (no browser launch)

Env:
  PERF_BASE_URL / PERF_GAMES / PERF_MOVES / PERF_NAV_CYCLES / PERF_FRAME_MS
  PERF_MODE / PERF_PHASE / PERF_DATE / PERF_FIXED_GAMES / PERF_FIX_NOTES`;

export const RENDER_PERF_USAGE = `Usage: node scripts/render-perf.mjs

Render / input latency harness (Playwright + CDP + Performance API).
Prefer: npm run perf:render

Options:
  -h, --help       Show this help and exit (no browser launch)

Env:
  PERF_PHASE / PERF_GAMES / PERF_MOVES / PERF_CPU_RATE / PERF_BASE_URL`;

/** Help-only harness scripts that share applyBrowserHarnessCli. */
export const HELP_ONLY_BROWSER_HARNESS_USAGES = [
  { script: 'scripts/console-sweep.mjs', usage: CONSOLE_SWEEP_USAGE },
  { script: 'scripts/nav-away-sweep.mjs', usage: NAV_AWAY_SWEEP_USAGE },
  { script: 'scripts/memory-leak-audit.mjs', usage: MEMORY_LEAK_AUDIT_USAGE },
  { script: 'scripts/runtime-perf.mjs', usage: RUNTIME_PERF_USAGE },
  { script: 'scripts/render-perf.mjs', usage: RENDER_PERF_USAGE },
];
