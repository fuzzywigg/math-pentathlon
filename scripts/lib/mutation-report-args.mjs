/**
 * Argv parsing for scripts/mutation-report.mjs
 * (q-mp-867 / q-mp-868 / q-mp-892 / q-mp-967).
 * Kept free of TypeScript AST / vitest so unit tests can import hermetically.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/mutation-report-args.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. mutation-report.mjs).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

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

export const MUTATION_REPORT_ARGS_USAGE = `Usage: node scripts/lib/mutation-report-args.mjs [--help]

Library module — import from harness scripts (e.g. scripts/mutation-report.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

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
 * Parse CLI flags. Rejects empty / whitespace-only `--max=` / `--games=` /
 * `--json=`, non-integer / negative `--max`, non-integer / `<5000`
 * `--timeout`, and unknown flags instead of silently coercing or ignoring
 * them. `--max=0` remains intentional “all”. `--help` / `-h` and `--dry-run`
 * never mutate product trees. Floats like `--max=2.9` / `--timeout=5000.5`
 * are rejected (q-mp-1217).
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
  let gamesProvided = false;
  let jsonProvided = false;
  let maxRaw = '';
  let timeoutRaw = '';
  let gamesRaw = '';
  let jsonRaw = '';

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg.startsWith('--games=')) {
      gamesProvided = true;
      gamesRaw = arg.slice(8);
      opts.games = gamesRaw
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
      jsonProvided = true;
      jsonRaw = arg.slice(7);
      opts.jsonOut = resolveJson(jsonRaw);
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

  // q-mp-967: empty / whitespace-only --max= must not coerce via Number('')===0
  // (that sentinel is reserved for intentional --max=0 “all”).
  if (maxProvided && maxRaw.trim() === '') {
    return {
      ok: false,
      message: `Invalid --max value (need number >= 0): ${maxRaw}`,
    };
  }

  // q-mp-1217: require integer --max (Number("2.9") is finite but truncates
  // later via slice); keep --max=0 as intentional “all”.
  if (maxProvided && (!Number.isInteger(opts.max) || opts.max < 0)) {
    return {
      ok: false,
      message: `Invalid --max value (need integer >= 0): ${maxRaw}`,
    };
  }

  // q-mp-1217: require integer --timeout (reject e.g. --timeout=5000.5).
  if (
    timeoutProvided &&
    (!Number.isInteger(opts.timeoutMs) || opts.timeoutMs < 5_000)
  ) {
    return {
      ok: false,
      message: `Invalid --timeout value (need integer >= 5000): ${timeoutRaw}`,
    };
  }

  // q-mp-967: empty / whitespace-only / comma-only --games= must not resolve
  // to a zero-game plan.
  if (
    gamesProvided &&
    (gamesRaw.trim() === '' || (opts.games != null && opts.games.length === 0))
  ) {
    return {
      ok: false,
      message: 'Invalid --games value (need non-empty game id list)',
    };
  }

  // q-mp-967: empty / whitespace-only --json= must not accept empty jsonOut.
  if (jsonProvided && jsonRaw.trim() === '') {
    return {
      ok: false,
      message: 'Invalid --json value (need non-empty path)',
    };
  }

  return { ok: true, opts };
}

/**
 * Resolve game list; reject unknown ids before any rules.ts I/O.
 * Dedupes requested ids preserving first-seen order (q-mp-1232) so
 * `--games=hex,hex` does not double-run mutants.
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
  // q-mp-1232: unique while keeping caller order (Set insertion order).
  return { ok: true, games: [...new Set(requested)] };
}

/**
 * CLI entry when this file is executed directly (q-mp-975).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(MUTATION_REPORT_ARGS_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(MUTATION_REPORT_ARGS_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
