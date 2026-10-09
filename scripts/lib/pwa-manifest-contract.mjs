/**
 * PWA installability contract (Lighthouse-style) for Math Pentathlon.
 *
 * Shared by hermetic unit tests (source vite.config + index.html) and the
 * post-build `check:pwa-manifest` report (parses dist/site.webmanifest).
 *
 * Does not cover offline/runtime SW behavior (#458/#479) or build repro (#524).
 */

/** @typedef {{ src: string, sizes?: string, type?: string, purpose?: string }} ManifestIcon */

/** Brand / splash chrome (matches vite PWA theme_color + favicon rect). */
export const THEME_COLOR_DARK = '#102a43';
/** Page body chrome under prefers-color-scheme: light (src/style.css body bg). */
export const THEME_COLOR_LIGHT = '#f8fafc';

/** Required web app manifest fields for installability. */
export const REQUIRED_MANIFEST = Object.freeze({
  name: 'Math Pentathlon',
  short_name: 'Math Pentathlon',
  id: '/',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  theme_color: THEME_COLOR_DARK,
  background_color: THEME_COLOR_DARK,
  lang: 'en',
});

/** Required icon entries (sizes + purpose). */
export const REQUIRED_ICONS = Object.freeze([
  Object.freeze({
    src: '/icons/icon-192.png',
    sizes: '192x192',
    purpose: 'any',
  }),
  Object.freeze({
    src: '/icons/icon-512.png',
    sizes: '512x512',
    purpose: 'any',
  }),
  Object.freeze({
    src: '/icons/icon-512-maskable.png',
    sizes: '512x512',
    purpose: 'maskable',
  }),
]);

export const APPLE_TOUCH_ICON = '/icons/icon-180.png';

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalize purpose tokens (manifest allows space-separated lists).
 * @param {string | undefined} purpose
 * @returns {Set<string>}
 */
export function purposeTokens(purpose) {
  if (!purpose || typeof purpose !== 'string') {
    // Spec default when omitted is "any".
    return new Set(['any']);
  }
  return new Set(
    purpose
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

/**
 * Validate a parsed web app manifest against the installability contract.
 * @param {unknown} manifest
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateManifest(manifest) {
  /** @type {string[]} */
  const errors = [];
  if (!isRecord(manifest)) {
    return { ok: false, errors: ['manifest is not an object'] };
  }

  for (const [key, expected] of Object.entries(REQUIRED_MANIFEST)) {
    const actual = manifest[key];
    if (actual !== expected) {
      errors.push(
        `manifest.${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
      );
    }
  }

  // Installability: display must be standalone | fullscreen | minimal-ui
  const display = manifest.display;
  if (
    display !== 'standalone' &&
    display !== 'fullscreen' &&
    display !== 'minimal-ui'
  ) {
    errors.push(
      `manifest.display must be standalone|fullscreen|minimal-ui (got ${JSON.stringify(display)})`
    );
  }

  if (manifest.prefer_related_applications === true) {
    errors.push(
      'manifest.prefer_related_applications must not be true (blocks installability)'
    );
  }

  const icons = manifest.icons;
  if (!Array.isArray(icons) || icons.length === 0) {
    errors.push('manifest.icons must be a non-empty array');
  } else {
    for (const required of REQUIRED_ICONS) {
      const match = icons.find((icon) => {
        if (!isRecord(icon)) return false;
        if (icon.src !== required.src) return false;
        if (icon.sizes !== required.sizes) return false;
        return purposeTokens(
          typeof icon.purpose === 'string' ? icon.purpose : undefined
        ).has(required.purpose);
      });
      if (!match) {
        errors.push(
          `missing icon ${required.src} sizes=${required.sizes} purpose=${required.purpose}`
        );
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Validate index.html install meta tags (apple + theme-color light/dark).
 * @param {string} html
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateIndexHtml(html) {
  /** @type {string[]} */
  const errors = [];
  if (typeof html !== 'string' || html.length === 0) {
    return { ok: false, errors: ['index.html is empty'] };
  }

  if (
    !html.includes(`rel="apple-touch-icon" href="${APPLE_TOUCH_ICON}"`) &&
    !html.includes(`rel='apple-touch-icon' href='${APPLE_TOUCH_ICON}'`)
  ) {
    errors.push(`missing apple-touch-icon ${APPLE_TOUCH_ICON}`);
  }

  if (!/apple-mobile-web-app-capable[^>]*content=["']yes["']/.test(html)) {
    errors.push('missing apple-mobile-web-app-capable=yes');
  }

  if (
    !/apple-mobile-web-app-title[^>]*content=["']Math Pentathlon["']/.test(html)
  ) {
    errors.push('missing apple-mobile-web-app-title=Math Pentathlon');
  }

  const hasLightTheme = new RegExp(
    `name=["']theme-color["'][^>]*content=["']${THEME_COLOR_LIGHT}["'][^>]*media=["']\\(prefers-color-scheme:\\s*light\\)["']` +
      `|` +
      `name=["']theme-color["'][^>]*media=["']\\(prefers-color-scheme:\\s*light\\)["'][^>]*content=["']${THEME_COLOR_LIGHT}["']`,
    'i'
  ).test(html);

  const hasDarkTheme = new RegExp(
    `name=["']theme-color["'][^>]*content=["']${THEME_COLOR_DARK}["'][^>]*media=["']\\(prefers-color-scheme:\\s*dark\\)["']` +
      `|` +
      `name=["']theme-color["'][^>]*media=["']\\(prefers-color-scheme:\\s*dark\\)["'][^>]*content=["']${THEME_COLOR_DARK}["']`,
    'i'
  ).test(html);

  // Fallback theme-color (no media) for older browsers — brand dark splash.
  const hasFallbackTheme =
    /name=["']theme-color["']\s+content=["']#102a43["']\s*\/?>/.test(html) ||
    /name=["']theme-color["']\s+content=["']#102a43["'](?![^>]*media=)/.test(
      html
    );

  if (!hasLightTheme) {
    errors.push(
      `missing theme-color ${THEME_COLOR_LIGHT} for prefers-color-scheme: light`
    );
  }
  if (!hasDarkTheme) {
    errors.push(
      `missing theme-color ${THEME_COLOR_DARK} for prefers-color-scheme: dark`
    );
  }
  if (!hasFallbackTheme && !hasDarkTheme) {
    errors.push(`missing fallback theme-color ${THEME_COLOR_DARK}`);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Extract the VitePWA `manifest: { ... }` object literal from vite.config.ts
 * source (hermetic — no Vite load).
 * @param {string} viteConfigSource
 * @returns {unknown}
 */
export function parseManifestLiteralFromViteConfig(viteConfigSource) {
  const marker = /manifest:\s*\{/;
  const match = marker.exec(viteConfigSource);
  if (!match || match.index === undefined) {
    throw new Error('vite.config.ts: could not find manifest: {');
  }
  const start = match.index + match[0].indexOf('{');
  let depth = 0;
  let inStr = null;
  let escaped = false;
  for (let i = start; i < viteConfigSource.length; i++) {
    const ch = viteConfigSource[i];
    if (inStr) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const literal = viteConfigSource.slice(start, i + 1);
        // Convert TS object literal to JSON-ish: quote bare keys, keep strings.
        return evalManifestLiteral(literal);
      }
    }
  }
  throw new Error('vite.config.ts: unclosed manifest object');
}

/**
 * Evaluate the manifest object literal from trusted repo source (vite.config.ts).
 * Uses Function (not JSON.parse) so trailing commas / single quotes stay valid.
 * @param {string} literal
 * @returns {unknown}
 */
function evalManifestLiteral(literal) {
  // Trusted checked-in source only — never pass untrusted input here.
  // eslint-disable-next-line no-new-func -- hermetic parse of our own vite.config.ts
  return new Function(`"use strict"; return (${literal});`)();
}

/**
 * Assert VitePWA SW registration scope + update strategy from config source.
 * @param {string} viteConfigSource
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateVitePwaShell(viteConfigSource) {
  /** @type {string[]} */
  const errors = [];
  if (!/registerType:\s*'autoUpdate'/.test(viteConfigSource)) {
    errors.push("VitePWA registerType must be 'autoUpdate' (no stale shell)");
  }
  if (!/injectRegister:\s*false/.test(viteConfigSource)) {
    errors.push('VitePWA injectRegister must be false (manual bootstrap)');
  }
  // Plugin-level scope (SW registration) and manifest.scope both root.
  if (!/scope:\s*'\/'/.test(viteConfigSource)) {
    errors.push("PWA scope must be '/' (match base path)");
  }
  if (!/start_url:\s*'\/'/.test(viteConfigSource)) {
    errors.push("manifest start_url must be '/'");
  }
  if (!/cleanupOutdatedCaches:\s*true/.test(viteConfigSource)) {
    errors.push('workbox.cleanupOutdatedCaches must be true');
  }
  return { ok: errors.length === 0, errors };
}
