/**
 * PWA tablet install icons — manifest paths must exist on disk (public + dist).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(process.cwd());

function iconSrcsFromViteConfig(source: string): string[] {
  const iconsBlock = source.match(/icons:\s*\[([\s\S]*?)\],\s*\}/);
  expect(iconsBlock, 'vite.config.ts icons array').toBeTruthy();
  const srcs = [...iconsBlock![1].matchAll(/src:\s*'([^']+)'/g)].map(
    (m) => m[1]
  );
  expect(srcs.length).toBeGreaterThan(0);
  return srcs;
}

function publicPathForManifestSrc(src: string): string {
  const rel = src.replace(/^\//, '');
  return join(root, 'public', rel);
}

function distPathForManifestSrc(src: string): string {
  const rel = src.replace(/^\//, '');
  return join(root, 'dist', rel);
}

describe('PWA tablet install icons', () => {
  const viteConfig = readFileSync(join(root, 'vite.config.ts'), 'utf8');
  const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
  const iconSrcs = iconSrcsFromViteConfig(viteConfig);

  it('manifest lists 192/512 PNG any + 512 maskable icons', () => {
    expect(iconSrcs).toContain('/icons/icon-192.png');
    expect(iconSrcs).toContain('/icons/icon-512.png');
    expect(iconSrcs).toContain('/icons/icon-512-maskable.png');
    expect(viteConfig).toMatch(
      /src:\s*'\/icons\/icon-512-maskable\.png'[\s\S]*?purpose:\s*'maskable'/
    );
  });

  it('apple-touch-icon points at 180 PNG (iOS ignores SVG)', () => {
    expect(indexHtml).toContain(
      'rel="apple-touch-icon" href="/icons/icon-180.png"'
    );
    expect(indexHtml).not.toMatch(
      /rel="apple-touch-icon"[^>]*href="[^"]*\.svg"/
    );
  });

  it('Workbox includeAssets + globPatterns cover PNG icons', () => {
    expect(viteConfig).toMatch(/includeAssets:[\s\S]*'icons\/\*\.png'/);
    expect(viteConfig).toMatch(
      /globPatterns:[\s\S]*\*\*\/\*\.\{[^}'"]*png[^}'"]*\}/
    );
  });

  it('every manifest icon path exists under public/', () => {
    for (const src of iconSrcs) {
      const path = publicPathForManifestSrc(src);
      expect(existsSync(path), `missing public asset for ${src}`).toBe(true);
    }
    expect(existsSync(join(root, 'public/icons/icon-180.png'))).toBe(true);
  });

  it.skipIf(!existsSync(join(root, 'dist/site.webmanifest')))(
    'every manifest icon path exists under dist/ after build',
    () => {
      const manifestPath = join(root, 'dist/site.webmanifest');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        icons?: Array<{ src: string }>;
      };
      expect(manifest.icons?.length ?? 0).toBeGreaterThan(0);

      for (const icon of manifest.icons!) {
        const path = distPathForManifestSrc(icon.src);
        expect(existsSync(path), `missing dist asset for ${icon.src}`).toBe(
          true
        );
      }

      // Apple touch icon is HTML-only (not always in webmanifest).
      expect(existsSync(join(root, 'dist/icons/icon-180.png'))).toBe(true);
    }
  );
});
