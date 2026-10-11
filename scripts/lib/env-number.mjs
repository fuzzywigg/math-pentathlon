/**
 * Env-number parsing for harness scripts (q-mp-876 / q-mp-908).
 * Rejects non-finite / non-positive values before browser launch.
 * Kept free of Playwright so unit tests can import it hermetically.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/env-number.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. runtime-perf, render-perf).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const ENV_NUMBER_USAGE = `Usage: node scripts/lib/env-number.mjs [--help]

Library module — import from harness scripts (e.g. scripts/runtime-perf.mjs,
scripts/render-perf.mjs, scripts/memory-leak-audit.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * @typedef {{ requirePositive?: boolean }} EnvNumberOpts
 */

/**
 * Parse a numeric environment variable.
 * Unset or empty → `defaultValue`. Non-finite (and non-positive when required)
 * → usage error naming the variable.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env
 * @param {string} name
 * @param {number} defaultValue
 * @param {EnvNumberOpts} [opts]
 * @returns {{ ok: true, value: number } | { ok: false, message: string }}
 */
export function parseEnvNumber(env, name, defaultValue, opts = {}) {
  const requirePositive = opts.requirePositive !== false;
  const raw = env[name];
  if (raw === undefined || raw === '') {
    return { ok: true, value: defaultValue };
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return {
      ok: false,
      message: `Invalid ${name}=${JSON.stringify(String(raw))} (expected a finite number).`,
    };
  }
  if (requirePositive && !(n > 0)) {
    return {
      ok: false,
      message: `Invalid ${name}=${JSON.stringify(String(raw))} (expected a positive number).`,
    };
  }
  return { ok: true, value: n };
}

/**
 * Resolve a numeric env var or print a one-line error and exit non-zero.
 *
 * @param {string} name
 * @param {number} defaultValue
 * @param {EnvNumberOpts} [opts]
 * @returns {number}
 */
export function requireEnvNumber(name, defaultValue, opts = {}) {
  const result = parseEnvNumber(process.env, name, defaultValue, opts);
  if (!result.ok) {
    console.error(result.message);
    process.exit(2);
  }
  return result.value;
}

/**
 * CLI entry when this file is executed directly (q-mp-958).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(ENV_NUMBER_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(ENV_NUMBER_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
