/**
 * Type-only companion for `pwa-manifest-contract.mjs` (Batch 8 helper-test ratchet).
 * Emit-erased; no runtime.
 */

export const THEME_COLOR_DARK: string;
export const THEME_COLOR_LIGHT: string;
export const REQUIRED_MANIFEST: Readonly<Record<string, string>>;
export const REQUIRED_ICONS: ReadonlyArray<
  Readonly<{ src: string; sizes: string; purpose: string }>
>;
export const APPLE_TOUCH_ICON: string;

export function purposeTokens(purpose: string | undefined): Set<string>;

export function validateManifest(manifest: unknown): {
  ok: boolean;
  errors: string[];
};

export function validateIndexHtml(html: string): {
  ok: boolean;
  errors: string[];
};

export function parseManifestLiteralFromViteConfig(
  viteConfigSource: string
): unknown;

export function validateVitePwaShell(viteConfigSource: string): {
  ok: boolean;
  errors: string[];
};
