/**
 * Hermetic PWA installability contract (burn-1008-mp-pwa-manifest).
 *
 * Always asserts vite.config.ts + index.html source. When dist/ exists
 * (after `npm run build`), also parses the built site.webmanifest.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  APPLE_TOUCH_ICON,
  REQUIRED_ICONS,
  parseManifestLiteralFromViteConfig,
  validateIndexHtml,
  validateManifest,
  validateVitePwaShell,
} from '../../scripts/lib/pwa-manifest-contract.mjs';

const root = resolve(process.cwd());

describe('PWA installability contract (hermetic source)', () => {
  const viteConfig = readFileSync(join(root, 'vite.config.ts'), 'utf8');
  const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');

  it('vite.config.ts manifest literal matches installability contract', () => {
    const manifest = parseManifestLiteralFromViteConfig(viteConfig);
    const result = validateManifest(manifest);
    expect(result.errors, result.errors.join('\n')).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('VitePWA shell uses autoUpdate + root scope + cache cleanup', () => {
    const result = validateVitePwaShell(viteConfig);
    expect(result.errors, result.errors.join('\n')).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('index.html has apple-touch-icon and light/dark theme-color', () => {
    const result = validateIndexHtml(indexHtml);
    expect(result.errors, result.errors.join('\n')).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('required icon files exist under public/', () => {
    for (const icon of REQUIRED_ICONS) {
      const path = join(root, 'public', icon.src.replace(/^\//, ''));
      expect(existsSync(path), `missing ${icon.src}`).toBe(true);
    }
    expect(
      existsSync(join(root, 'public', APPLE_TOUCH_ICON.replace(/^\//, '')))
    ).toBe(true);
  });
});

describe('PWA installability contract (built dist)', () => {
  const manifestPath = join(root, 'dist/site.webmanifest');

  it.skipIf(!existsSync(manifestPath))(
    'dist/site.webmanifest + index.html satisfy the contract',
    () => {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        icons: Array<{ src: string }>;
      };
      const manifestResult = validateManifest(manifest);
      expect(manifestResult.errors, manifestResult.errors.join('\n')).toEqual(
        []
      );

      const html = readFileSync(join(root, 'dist/index.html'), 'utf8');
      const htmlResult = validateIndexHtml(html);
      expect(htmlResult.errors, htmlResult.errors.join('\n')).toEqual([]);

      expect(html).toMatch(/rel=["']manifest["'][^>]*site\.webmanifest/);

      for (const icon of manifest.icons) {
        const path = join(root, 'dist', icon.src.replace(/^\//, ''));
        expect(existsSync(path), `missing dist ${icon.src}`).toBe(true);
      }
    }
  );
});
