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
 */
import { mkdirSync as fsMkdirSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

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
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') {
    const target = isAbsolute(fromEnv) ? fromEnv : resolve(cwd, fromEnv);
    try {
      return ensureDir(target, mkdirSync);
    } catch {
      // Fall through when the explicit override is not creatable.
    }
  }

  try {
    return ensureDir(cloudDir, mkdirSync);
  } catch {
    return ensureDir(resolve(cwd, localRel), mkdirSync);
  }
}

/**
 * Join path segments under the resolved artifact root.
 *
 * @param {...string} parts
 * @returns {string}
 */
export function artifactPath(...parts) {
  return join(resolveArtifactDir(), ...parts);
}
