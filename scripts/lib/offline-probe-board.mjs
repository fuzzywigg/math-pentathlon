/**
 * Shared board / recovery predicates for the prod offline resilience probe
 * (q-mp-1295 / q-mp-1296).
 *
 * Shell chrome (`#board`, `h1`) persists when a game fails to mount. Board-ok
 * and chunk-retry `recovered` must require game-specific mounts and no
 * `game-load-error` UI — never treat shell-only selectors as success.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/offline-probe-board.mjs [--help]
 * Unknown flags exit 2. Import from scripts/probe-offline-resilience.mjs.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const OFFLINE_PROBE_BOARD_USAGE = `Usage: node scripts/lib/offline-probe-board.mjs [--help]

Library module — import from scripts/probe-offline-resilience.mjs.
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/** Hex 2D board mount (not shell `#board`). */
export const OFFLINE_PROBE_HEX_MOUNT = '.hex-board';

/** Pent-em-in 2D board mount (not shell `#board` / `h1`). */
export const OFFLINE_PROBE_PENT_MOUNT = '.pent-board';

/** Hex-a-Gone 2D board or 3D canvas (not shell `#board`). */
export const OFFLINE_PROBE_HAG_MOUNT = '.hex-a-gone-board, canvas[data-mp3d]';

/** Calla board mounts (not shell `#board`). */
export const OFFLINE_PROBE_CALLA_MOUNT = '.calla-wrapper, .calla-pit';

/** Friendly lazy-load failure surface. */
export const OFFLINE_PROBE_LOAD_ERROR = '[data-testid="game-load-error"]';

/**
 * True when a game-specific mount is present and load-error UI is absent.
 * Shell `#board` / `h1` counts must not be passed as `mountCount`.
 *
 * @param {{ mountCount?: unknown, loadErrorCount?: unknown }} counts
 * @returns {boolean}
 */
export function isOfflineProbeMountOk(counts) {
  const mountCount = Number(counts?.mountCount);
  const loadErrorCount = Number(counts?.loadErrorCount);
  if (!Number.isFinite(mountCount) || !Number.isFinite(loadErrorCount)) {
    return false;
  }
  return mountCount > 0 && loadErrorCount === 0;
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
    console.error(OFFLINE_PROBE_BOARD_USAGE);
    process.exit(2);
  }
  console.log(OFFLINE_PROBE_BOARD_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
