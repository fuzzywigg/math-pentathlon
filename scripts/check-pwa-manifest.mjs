#!/usr/bin/env node
/**
 * Post-build PWA installability check (report-only by default).
 *
 * Parses dist/site.webmanifest + dist/index.html and asserts the install
 * contract. Always writes test-results/pwa-manifest/summary.md.
 *
 * Exit codes:
 *   0 — contract ok, or REPORT_ONLY=1 (default) even when violations found
 *   1 — violations and REPORT_ONLY=0
 *
 * Usage:
 *   npm run build && npm run check:pwa-manifest
 *   REPORT_ONLY=0 npm run check:pwa-manifest   # opt-in local exit 1 on violations
 *
 * CI `build` soft step runs `npm run check:pwa-manifest` without REPORT_ONLY=0
 * (report-only / continue-on-error). Tip-owner must wire REPORT_ONLY=0 if CI
 * should fail on violations — out of scope for docs-only wording fixes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateIndexHtml,
  validateManifest,
  validateVitePwaShell,
} from './lib/pwa-manifest-contract.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'test-results', 'pwa-manifest');
const SUMMARY_MD = path.join(OUT_DIR, 'summary.md');
const SUMMARY_JSON = path.join(OUT_DIR, 'summary.json');

const REPORT_ONLY = process.env.REPORT_ONLY !== '0';

/**
 * True when html has a <link> with rel=manifest and an href ending in
 * site.webmanifest — either attribute order, double or single quotes.
 * (Harness leftover; contract helpers stay untouched.)
 * @param {string} html
 * @returns {boolean}
 */
export function hasSiteWebmanifestLink(html) {
  if (typeof html !== 'string' || html.length === 0) return false;
  const linkRe = /<link\b[^>]*>/gi;
  const relRe = /\brel=["']manifest["']/i;
  const hrefRe = /\bhref=["'][^"']*site\.webmanifest["']/i;
  let match;
  while ((match = linkRe.exec(html)) !== null) {
    const tag = match[0];
    if (relRe.test(tag) && hrefRe.test(tag)) {
      return true;
    }
  }
  return false;
}

/**
 * Resolve a manifest icon `src` to an absolute path under `distRoot`.
 * Rejects scheme-bearing URLs, non-root-absolute paths, and traversal that
 * escapes `distRoot` (path.join alone would false-pass `../…`).
 *
 * @param {string} distRoot
 * @param {string} src
 * @returns {{ ok: true, abs: string } | { ok: false, error: string }}
 */
export function resolveManifestIconPath(distRoot, src) {
  if (typeof src !== 'string' || src.length === 0) {
    return { ok: false, error: `invalid icon src: ${JSON.stringify(src)}` };
  }
  // scheme-bearing (https:, data:, …) or protocol-relative //host/…
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src) || src.startsWith('//')) {
    return { ok: false, error: `icon src must not be a URL: ${src}` };
  }
  if (!src.startsWith('/')) {
    return { ok: false, error: `icon src must be root-absolute: ${src}` };
  }
  const rel = src.slice(1);
  if (
    rel.length === 0 ||
    path.isAbsolute(rel) ||
    rel.split(/[/\\]/).includes('..')
  ) {
    return { ok: false, error: `icon src escapes dist/: ${src}` };
  }
  const distResolved = path.resolve(distRoot);
  const abs = path.resolve(distResolved, rel);
  const prefix = distResolved.endsWith(path.sep)
    ? distResolved
    : `${distResolved}${path.sep}`;
  if (abs !== distResolved && !abs.startsWith(prefix)) {
    return { ok: false, error: `icon src escapes dist/: ${src}` };
  }
  return { ok: true, abs };
}

/**
 * Collect icon on-disk errors for a parsed manifest icons array.
 * @param {string} distRoot
 * @param {unknown} icons
 * @returns {string[]}
 */
export function collectManifestIconErrors(distRoot, icons) {
  /** @type {string[]} */
  const errors = [];
  if (!Array.isArray(icons)) return errors;
  for (const icon of icons) {
    if (!icon || typeof icon !== 'object') continue;
    const src = /** @type {{src?: unknown}} */ (icon).src;
    if (typeof src !== 'string') continue;
    const resolved = resolveManifestIconPath(distRoot, src);
    if (!resolved.ok) {
      errors.push(resolved.error);
      continue;
    }
    if (!fs.existsSync(resolved.abs)) {
      errors.push(`missing dist asset for icon ${src}`);
    }
  }
  return errors;
}

/**
 * @param {string[]} lines
 * @param {Record<string, unknown>} payload
 * @returns {never | void}
 */
function writeSummary(lines, payload) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(SUMMARY_MD, `${lines.join('\n')}\n`, 'utf8');
  fs.writeFileSync(
    SUMMARY_JSON,
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8'
  );
  console.log(lines.join('\n'));
}

function main() {
  /** @type {string[]} */
  const errors = [];
  const manifestPath = path.join(DIST, 'site.webmanifest');
  const indexPath = path.join(DIST, 'index.html');
  const viteConfigPath = path.join(ROOT, 'vite.config.ts');

  if (!fs.existsSync(manifestPath)) {
    errors.push(
      `missing ${path.relative(ROOT, manifestPath)} (run npm run build)`
    );
  }
  if (!fs.existsSync(indexPath)) {
    errors.push(
      `missing ${path.relative(ROOT, indexPath)} (run npm run build)`
    );
  }

  /** @type {unknown} */
  let manifest = null;
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const result = validateManifest(manifest);
      errors.push(...result.errors);
    } catch (err) {
      errors.push(
        `failed to parse site.webmanifest: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    const result = validateIndexHtml(html);
    errors.push(...result.errors);
    if (!hasSiteWebmanifestLink(html)) {
      errors.push(
        'dist/index.html missing <link rel="manifest" href="…site.webmanifest">'
      );
    }
  }

  if (fs.existsSync(viteConfigPath)) {
    const viteSrc = fs.readFileSync(viteConfigPath, 'utf8');
    const shell = validateVitePwaShell(viteSrc);
    errors.push(...shell.errors);
  }

  // Icon files referenced by manifest must exist under dist/
  if (manifest && typeof manifest === 'object') {
    const icons = /** @type {{icons?: unknown}} */ (manifest).icons;
    errors.push(...collectManifestIconErrors(DIST, icons));
  }

  const appleTouch = path.join(DIST, 'icons', 'icon-180.png');
  if (!fs.existsSync(appleTouch)) {
    errors.push('missing dist/icons/icon-180.png');
  }

  const ok = errors.length === 0;
  const lines = [
    '# PWA manifest installability check',
    '',
    `- ok: **${ok}**`,
    `- reportOnly: ${REPORT_ONLY}`,
    `- manifest: \`${path.relative(ROOT, manifestPath)}\``,
    '',
    ok ? 'All installability contract checks passed.' : '## Violations',
    ...(ok ? [] : errors.map((e) => `- ${e}`)),
    '',
    '_Task: burn-1008-mp-pwa-manifest_',
  ];

  writeSummary(lines, {
    ok,
    reportOnly: REPORT_ONLY,
    errorCount: errors.length,
    errors,
  });

  if (!ok && !REPORT_ONLY) {
    process.exitCode = 1;
  }
}

const isMain =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
