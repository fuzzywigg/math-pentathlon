/**
 * `--out` / `--help` flag parsing for scripts/mobile-audit.mjs
 * (q-mp-844 + q-mp-900 help/unknown).
 * Kept free of Playwright so unit tests can import it hermetically.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/mobile-audit-out-path.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. mobile-audit.mjs).
 */
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const MOBILE_AUDIT_OUT_PATH_USAGE = `Usage: node scripts/lib/mobile-audit-out-path.mjs [--help]

Library module — import from harness scripts (e.g. scripts/mobile-audit.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Resolve `--out` / `--help` from argv. Missing `--out` → default path; flag
 * without a path value (or with another flag) → usage error (no TypeError from
 * path.resolve). `--help`/`-h` short-circuit before browser launch. Unknown
 * flags exit non-zero.
 *
 * @param {string[]} argv
 * @param {string} defaultPath
 * @returns
 *   | { ok: true, help: true }
 *   | { ok: true, outPath: string }
 *   | { ok: false, message: string }
 */
export function resolveMobileAuditOutPath(argv, defaultPath) {
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      return { ok: true, help: true };
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') {
      const value = argv[i + 1];
      if (value !== undefined && value !== '' && !value.startsWith('-')) {
        i += 1;
      }
      continue;
    }
    if (typeof a === 'string' && a.startsWith('-')) {
      return { ok: false, message: `Unknown flag: ${a}` };
    }
  }

  const outIdx = argv.indexOf('--out');
  if (outIdx < 0) {
    return { ok: true, outPath: defaultPath };
  }
  const value = argv[outIdx + 1];
  if (value === undefined || value === '' || value.startsWith('-')) {
    return {
      ok: false,
      message: 'Missing or invalid value for --out (expected a file path).',
    };
  }
  return { ok: true, outPath: resolve(value) };
}

export function mobileAuditOutUsage() {
  return `Usage: node scripts/mobile-audit.mjs [--out <path>]

Options:
  --out <path>   Write JSON report to path (default under docs/)
  -h, --help     Show this help and exit (no browser launch)`;
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
    console.error(MOBILE_AUDIT_OUT_PATH_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(MOBILE_AUDIT_OUT_PATH_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
