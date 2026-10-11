/**
 * `--out` / `--help` flag parsing for scripts/mobile-audit.mjs
 * (q-mp-844 + q-mp-900 help/unknown).
 * Kept free of Playwright so unit tests can import it hermetically.
 */
import { resolve } from 'node:path';

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
