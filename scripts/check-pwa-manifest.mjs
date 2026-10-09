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
 *   REPORT_ONLY=0 npm run check:pwa-manifest   # fail CI on violations
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
 * @param {string[]} lines
 * @returns {never | void}
 */
function writeSummary(lines, payload) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(SUMMARY_MD, `${lines.join('\n')}\n`, 'utf8');
  fs.writeFileSync(SUMMARY_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(lines.join('\n'));
}

function main() {
  /** @type {string[]} */
  const errors = [];
  const manifestPath = path.join(DIST, 'site.webmanifest');
  const indexPath = path.join(DIST, 'index.html');
  const viteConfigPath = path.join(ROOT, 'vite.config.ts');

  if (!fs.existsSync(manifestPath)) {
    errors.push(`missing ${path.relative(ROOT, manifestPath)} (run npm run build)`);
  }
  if (!fs.existsSync(indexPath)) {
    errors.push(`missing ${path.relative(ROOT, indexPath)} (run npm run build)`);
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
    if (!/rel=["']manifest["'][^>]*href=["'][^"']*site\.webmanifest["']/.test(html)) {
      errors.push('dist/index.html missing <link rel="manifest" href="…site.webmanifest">');
    }
  }

  if (fs.existsSync(viteConfigPath)) {
    const viteSrc = fs.readFileSync(viteConfigPath, 'utf8');
    const shell = validateVitePwaShell(viteSrc);
    errors.push(...shell.errors);
  }

  // Icon files referenced by manifest must exist under dist/
  if (manifest && typeof manifest === 'object' && Array.isArray(/** @type {{icons?: unknown}} */ (manifest).icons)) {
    for (const icon of /** @type {{src?: string}[]} */ (/** @type {{icons: unknown}} */ (manifest).icons)) {
      if (!icon || typeof icon.src !== 'string') continue;
      const rel = icon.src.replace(/^\//, '');
      const abs = path.join(DIST, rel);
      if (!fs.existsSync(abs)) {
        errors.push(`missing dist asset for icon ${icon.src}`);
      }
    }
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
    "",
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

main();
