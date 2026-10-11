/**
 * Type-only companion for `report-licenses.mjs` (Batch 8 helper-test ratchet).
 * Emit-erased; no runtime.
 */

export type LicenseClassification =
  'denied' | 'copyleft_or_review' | 'unknown' | 'ok';

export type BundledAssetCatalogEntry = {
  path: string;
  kind: string;
  name: string;
  license: string;
  licenseSource: string;
  thirdParty: boolean;
};

export type LockPackage = {
  lockPath: string;
  name: string;
  version: string;
  license: string;
  licenseSource: 'lockfile' | 'node_modules' | 'missing';
  production: boolean;
  optional: boolean;
  hasInstallScript: boolean;
  resolved: string;
  integrity: string;
  classification: LicenseClassification;
};

export type BundledAssetInventory = BundledAssetCatalogEntry & {
  exists: boolean;
  bytes: number;
  sha256: string;
};

export const BUNDLED_ASSET_CATALOG: BundledAssetCatalogEntry[];

export function normalizeLicense(license: unknown): string;

export function classifyLicense(expression: string): LicenseClassification;

export function npmPackageNameFromLockPath(lockPath: string): string;

export function collectPackagesFromLock(
  lock: { packages?: Record<string, unknown> },
  nodeModulesRoot?: string
): LockPackage[];

export function countByLicense(packages: LockPackage[]): Record<string, number>;

export function inventoryBundledAssets(
  root: string,
  catalog?: BundledAssetCatalogEntry[]
): BundledAssetInventory[];

export function findUncataloguedPublicMedia(
  root: string,
  catalog?: BundledAssetCatalogEntry[]
): string[];

export function buildCycloneDxBom(opts: {
  name: string;
  version: string;
  packages: LockPackage[];
  assets: BundledAssetInventory[];
}): {
  bomFormat: string;
  specVersion: string;
  components: Array<Record<string, unknown>>;
};

export function formatSummaryMarkdown(report: unknown): string;

export const OUT_DIR: string;
export const OUT_DIR_REL: string;
export const USAGE: string;

export function parseArgs(
  argv: string[]
):
  { ok: true; help: boolean; dryRun: boolean } | { ok: false; message: string };

export function writeLicenseArtifacts(opts: {
  sbomText: string;
  summaryMd: string;
  summaryJsonText: string;
  dryRun?: boolean;
}): {
  wrote: boolean;
  outDir: string;
  paths: { sbom: string; summaryMd: string; summaryJson: string };
};

/** Stable malformed-lock message (q-mp-1026) — no stack. */
export function malformedLockMessage(
  lockPath?: string,
  detail?: string
): string;

/** True when lock.packages is a non-empty plain object (q-mp-1037). */
export function isUsableLockPackages(packages: unknown): boolean;

/** Stable empty/missing packages message (q-mp-1037). */
export function emptyPackagesMessage(lockPath?: string): string;
