/**
 * Shared ready-checks for offline probe harnesses (q-mp-1261 / q-mp-1262).
 *
 * - HTTP ready = 2xx only (HTTP 404 must not look "ready").
 * - PROBE_BROWSERS: trim (+ lower-case) comma-separated names.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/offline-probe-ready.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (webkit / probe-offline*).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const OFFLINE_PROBE_READY_USAGE = `Usage: node scripts/lib/offline-probe-ready.mjs [--help]

Library module — import from harness scripts (e.g. scripts/webkit-offline-probe.mjs,
scripts/probe-offline-resilience.mjs, scripts/probe-offline-resilience-dev.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * True only for HTTP 2xx (`Response.ok`). Bare 404 is not ready.
 *
 * @param {{ ok?: boolean, status?: number } | null | undefined} res
 * @returns {boolean}
 */
export function isHttpResponseReady(res) {
  return Boolean(res && res.ok === true);
}

/**
 * Poll until `url` returns a 2xx response, or throw on timeout.
 *
 * @param {string} url
 * @param {number} [timeoutMs=60_000]
 * @param {{
 *   fetch?: typeof fetch,
 *   sleep?: (ms: number) => Promise<void>,
 *   now?: () => number,
 *   pollMs?: number,
 *   timeoutMessage?: (url: string) => string,
 * }} [opts]
 * @returns {Promise<void>}
 */
export async function waitForUrl(url, timeoutMs = 60_000, opts = {}) {
  const fetchImpl = opts.fetch ?? globalThis.fetch.bind(globalThis);
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const now = opts.now ?? Date.now;
  const pollMs = opts.pollMs ?? 250;
  const timeoutMessage = opts.timeoutMessage ?? ((u) => `timeout ${u}`);
  const start = now();
  while (now() - start < timeoutMs) {
    try {
      const res = await fetchImpl(url);
      if (isHttpResponseReady(res)) return;
    } catch {
      // booting / connection refused
    }
    await sleep(pollMs);
  }
  throw new Error(timeoutMessage(url));
}

/**
 * Parse `PROBE_BROWSERS` (comma-separated). Trims and lower-cases each name.
 * Unset / empty / whitespace-only → `['webkit']`.
 *
 * @param {string | undefined | null} raw
 * @returns {string[]}
 */
export function parseProbeBrowsers(raw) {
  if (raw === undefined || raw === null) return ['webkit'];
  const parts = String(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
  return parts.length > 0 ? parts : ['webkit'];
}

/**
 * CLI entry when this file is executed directly.
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(OFFLINE_PROBE_READY_USAGE);
    process.exit(2);
  }
  console.log(OFFLINE_PROBE_READY_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
