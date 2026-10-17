/**
 * Writable artifact root for local harness scripts (q-mp-955).
 *
 * Resolution order (first creatable wins):
 * 1. `process.env.MP_ARTIFACT_DIR` when set / non-empty
 * 2. Cursor Cloud default `/opt/cursor/artifacts` when creatable
 * 3. Repo-local `test-results/agent-artifacts` (gitignored)
 *
 * Exports a small API for adopters (q-mp-956 / q-mp-957). This module does
 * not rewire harness defaults by itself.
 *
 * Kept free of Playwright so unit tests can inject a fake `mkdirSync`.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/artifact-dir.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. console-sweep, flake-rate).
 */
import { mkdirSync as fsMkdirSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const ARTIFACT_DIR_USAGE = `Usage: node scripts/lib/artifact-dir.mjs [--help]

Library module — import from harness scripts (e.g. scripts/console-sweep.mjs,
scripts/flake-rate-unit-loop.mjs, scripts/flake-rate-e2e-loop.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/** Cursor Cloud default artifact root. */
export const CLOUD_ARTIFACT_DIR = '/opt/cursor/artifacts';

/** Repo-local fallback when `/opt/…` is not creatable (e.g. laptop). */
export const LOCAL_ARTIFACT_DIR = 'test-results/agent-artifacts';

/**
 * @typedef {{
 *   env?: NodeJS.ProcessEnv | Record<string, string | undefined>,
 *   cwd?: string,
 *   mkdirSync?: (path: string, opts?: { recursive?: boolean }) => unknown,
 *   cloudDir?: string,
 *   localRel?: string,
 * }} ResolveArtifactDirOptions
 */

/**
 * Ensure `dir` exists (recursive mkdir). Returns `dir` on success.
 *
 * @param {string} dir
 * @param {(path: string, opts?: { recursive?: boolean }) => unknown} mkdirSync
 * @returns {string}
 */
function ensureDir(dir, mkdirSync) {
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Resolve a writable artifact root directory.
 *
 * @param {ResolveArtifactDirOptions} [options]
 * @returns {string} Absolute path to a directory that was created (or already existed).
 */
export function resolveArtifactDir(options = {}) {
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const mkdirSync = options.mkdirSync ?? fsMkdirSync;
  const cloudDir = options.cloudDir ?? CLOUD_ARTIFACT_DIR;
  const localRel = options.localRel ?? LOCAL_ARTIFACT_DIR;

  const fromEnv = env.MP_ARTIFACT_DIR;
  // Trim before path use (q-mp-1263): emptiness used to trim, but mkdir kept spaces.
  if (typeof fromEnv === 'string') {
    const trimmed = fromEnv.trim();
    if (trimmed !== '') {
      const target = isAbsolute(trimmed) ? trimmed : resolve(cwd, trimmed);
      try {
        return ensureDir(target, mkdirSync);
      } catch {
        // Fall through when the explicit override is not creatable.
      }
    }
  }

  try {
    return ensureDir(cloudDir, mkdirSync);
  } catch {
    return ensureDir(resolve(cwd, localRel), mkdirSync);
  }
}

/**
 * True when `candidate` is the same as `root` or a path under it.
 * Rejects `..` / absolute escapes (q-mp-1495).
 *
 * @param {string} root
 * @param {string} candidate
 * @returns {boolean}
 */
function isPathInsideRoot(root, candidate) {
  const rel = relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/**
 * Join path segments under the resolved artifact root.
 * Rejects joined paths that would resolve outside the root (q-mp-1495).
 *
 * @param {...string} parts
 * @returns {string}
 */
export function artifactPath(...parts) {
  const root = resolve(resolveArtifactDir());
  const candidate = resolve(root, ...parts);
  if (!isPathInsideRoot(root, candidate)) {
    const label = parts.length > 0 ? parts.join('/') : '(empty)';
    throw new Error(
      `artifactPath: path escapes artifact root (${root}): ${label}`
    );
  }
  return candidate;
}

/**
 * CLI entry when this file is executed directly (q-mp-980).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(ARTIFACT_DIR_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(ARTIFACT_DIR_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
