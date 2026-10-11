/**
 * Argv parsing for scripts/mutation-report.mjs (q-mp-867 / q-mp-868 / q-mp-892).
 * Kept free of TypeScript AST / vitest so unit tests can import hermetically.
 */

export const MUTATION_REPORT_USAGE =
  'Usage: node scripts/mutation-report.mjs [--games=id,id] [--max=N] [--timeout=MS] [--json=path] [--verbose-tests] [--dry-run] [-h|--help]\n' +
  '  --games=id,id   restrict to listed game ids (must exist under src/games/*/rules.ts)\n' +
  '  --max=N         max mutants per game (default 35; 0 = all; must be >= 0)\n' +
  '  --timeout=MS    per-mutant test timeout ms (default 45000; must be >= 5000)\n' +
  '  --json=path     write JSON report to path\n' +
  '  --verbose-tests show vitest output\n' +
  '  --dry-run       list games/plan and exit without writing rules.ts or JSON\n' +
  '  -h, --help      show this help and exit (no rules.ts I/O)\n' +
  'Unknown flags exit 2 before any mutation.';

/**
 * @typedef {{
 *   games: string[]|null,
 *   max: number,
 *   timeoutMs: number,
 *   jsonOut: string,
 *   quietTests: boolean,
 *   help: boolean,
 *   dryRun: boolean,
 * }} MutationReportOpts
 */

/**
 * Parse CLI flags. Rejects non-numeric / negative `--max`, non-numeric /
 * `<5000` `--timeout`, and unknown flags instead of silently coercing or
 * ignoring them. `--help` / `-h` and `--dry-run` never mutate product trees.
 *
 * @param {string[]} argv
 * @param {{ defaultJsonOut: string, resolveJson?: (p: string) => string }} defaults
 * @returns {{ ok: true, opts: MutationReportOpts } | { ok: false, message: string }}
 */
export function parseMutationReportArgs(argv, defaults) {
  const resolveJson = defaults.resolveJson ?? ((p) => p);
  /** @type {MutationReportOpts} */
  const opts = {
    games: null,
    max: 35,
    timeoutMs: 45_000,
    jsonOut: defaults.defaultJsonOut,
    quietTests: true,
    help: false,
    dryRun: false,
  };
  let maxProvided = false;
  let timeoutProvided = false;
  let maxRaw = '';
  let timeoutRaw = '';

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg.startsWith('--games=')) {
      opts.games = arg
        .slice(8)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--max=')) {
      maxProvided = true;
      maxRaw = arg.slice(6);
      opts.max = Number(maxRaw);
    } else if (arg.startsWith('--timeout=')) {
      timeoutProvided = true;
      timeoutRaw = arg.slice(10);
      opts.timeoutMs = Number(timeoutRaw);
    } else if (arg.startsWith('--json=')) {
      opts.jsonOut = resolveJson(arg.slice(7));
    } else if (arg === '--verbose-tests') {
      opts.quietTests = false;
    } else if (arg.startsWith('-')) {
      return { ok: false, message: `Unknown flag: ${arg}` };
    } else {
      return { ok: false, message: `Unexpected argument: ${arg}` };
    }
  }

  if (opts.help) {
    return { ok: true, opts };
  }

  if (maxProvided && (!Number.isFinite(opts.max) || opts.max < 0)) {
    return {
      ok: false,
      message: `Invalid --max value (need number >= 0): ${maxRaw}`,
    };
  }

  if (
    timeoutProvided &&
    (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs < 5_000)
  ) {
    return {
      ok: false,
      message: `Invalid --timeout value (need number >= 5000): ${timeoutRaw}`,
    };
  }

  return { ok: true, opts };
}

/**
 * Resolve game list; reject unknown ids before any rules.ts I/O.
 *
 * @param {string[]|null} requested
 * @param {string[]} validGames
 * @returns {{ ok: true, games: string[] } | { ok: false, message: string }}
 */
export function resolveMutationReportGames(requested, validGames) {
  if (requested == null) {
    return { ok: true, games: validGames };
  }
  const validSet = new Set(validGames);
  const unknown = requested.filter((g) => !validSet.has(g));
  if (unknown.length > 0) {
    return {
      ok: false,
      message:
        `unknown game(s): ${unknown.join(', ')}\n` +
        `valid games: ${validGames.join(', ')}`,
    };
  }
  return { ok: true, games: requested };
}
