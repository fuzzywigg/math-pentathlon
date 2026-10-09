/**
 * Type-only companion for `check-build.mjs` (Batch 8 helper-test ratchet).
 * Emit-erased; no runtime.
 */

export const PRECACHE_EXEMPT: Set<string>;
export const PRECACHE_FONT_IGNORES: Set<string>;
export const OFFLINE_EXTS: Set<string>;

export function parsePrecacheManifest(
  swSource: string
): Array<{ url: string; revision: string | null }>;

export function hashTree(root: string): Map<string, string>;

export function diffHashTrees(
  a: Map<string, string>,
  b: Map<string, string>
): { onlyA: string[]; onlyB: string[]; contentDiff: string[] };

export function listChunkNames(tree: Map<string, string>): string[];

export function offlineNeededPaths(relPaths: Iterable<string>): string[];

export function auditPrecache(distRoot: string): unknown;

export function scanEnvLeakage(distRoot: string): unknown;

export function auditSourcemapsAndBase(distRoot: string): unknown;
