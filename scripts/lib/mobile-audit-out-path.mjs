/**
 * `--out` flag parsing for scripts/mobile-audit.mjs (q-mp-844).
 * Kept free of Playwright so unit tests can import it hermetically.
 */
import { resolve } from 'node:path';

/**
 * Resolve `--out` from argv. Missing flag → default path; flag without a path
 * value (or with another flag) → usage error (no TypeError from path.resolve).
 *
 * @param {string[]} argv
 * @param {string} defaultPath
 * @returns {{ ok: true, outPath: string } | { ok: false, message: string }}
 */
export function resolveMobileAuditOutPath(argv, defaultPath) {
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
  return 'Usage: node scripts/mobile-audit.mjs [--out <path>]';
}
