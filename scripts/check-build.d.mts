/**
 * Type-only companion for `check-build.mjs` (Batch 8 helper-test ratchet).
 * Emit-erased; no runtime.
 */

export const PRECACHE_FONT_IGNORES: Set<string>;

export function parsePrecacheManifest(
  swSource: string
): Array<{ url: string; revision: string | null }>;

export function diffHashTrees(
  a: Map<string, string>,
  b: Map<string, string>
): { onlyA: string[]; onlyB: string[]; contentDiff: string[] };

export function listChunkNames(tree: Map<string, string>): string[];

export function offlineNeededPaths(relPaths: Iterable<string>): string[];

export function collectHtmlNonRootAssetRefs(html: string): string[];

export function parseCliArgs(argv: string[]): {
  help: boolean;
  unknown: string | null;
};

export function printHelp(): void;
