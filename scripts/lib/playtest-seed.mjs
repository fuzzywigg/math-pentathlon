/**
 * Seeded RNG helpers for deep-playtest harnesses (q-mp-1306).
 * Mulberry32 matches `createSeededRng` / e2e `browserInstallSeededRandom`.
 * Harness scripts install Node `Math.random` and/or Playwright page init RNG,
 * then record the seed in results JSON for stall replay.
 *
 * Env: `PLAYTEST_SEED` (optional; default `0x70a71e57`). Existing BASE env
 * names are unchanged.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/playtest-seed.mjs [--help]
 * Unknown flags exit 2.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const PLAYTEST_SEED_ENV = 'PLAYTEST_SEED';
/** Default when `PLAYTEST_SEED` is unset/empty. */
export const DEFAULT_PLAYTEST_SEED = 0x70a71e57;

export const PLAYTEST_SEED_USAGE = `Usage: node scripts/lib/playtest-seed.mjs [--help]

Library module — import from deep-playtest harness scripts.
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Resolve a uint32 seed from env (or default).
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} [env]
 * @param {string} [envName]
 * @param {number} [defaultSeed]
 * @returns {number}
 */
export function resolvePlaytestSeed(
  env = process.env,
  envName = PLAYTEST_SEED_ENV,
  defaultSeed = DEFAULT_PLAYTEST_SEED
) {
  const raw = env?.[envName];
  if (raw === undefined || raw === '') {
    return defaultSeed >>> 0;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return defaultSeed >>> 0;
  }
  return n >>> 0;
}

/**
 * Mulberry32 PRNG (same stream as `createSeededRng`).
 * @param {number} seed
 * @returns {() => number}
 */
export function createPlaytestRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Replace Node `Math.random` with a fresh seeded stream (no restore).
 * @param {number} seed
 */
export function installHarnessSeededRandom(seed) {
  Math.random = createPlaytestRng(seed);
}

/**
 * Self-contained browser callback for Playwright `addInitScript`.
 * Must not close over module scope — Playwright serializes the function body.
 * @param {number} seed
 */
export function browserInstallPlaytestSeededRandom(seed) {
  let t = seed >>> 0;
  Math.random = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Install seeded `Math.random` on a Playwright page or context before navigation.
 *
 * @param {{ addInitScript: (fn: Function, arg?: unknown) => Promise<unknown> }} pageOrContext
 * @param {number} seed
 * @returns {Promise<void>}
 */
export async function installPageSeededRandom(pageOrContext, seed) {
  await pageOrContext.addInitScript(
    browserInstallPlaytestSeededRandom,
    seed >>> 0
  );
}

/**
 * CLI entry when this file is executed directly.
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(PLAYTEST_SEED_USAGE);
    process.exit(2);
  }
  console.log(PLAYTEST_SEED_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
