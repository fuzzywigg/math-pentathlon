/**
 * Edge cases for the shared PWA installability contract helpers.
 */
import { describe, expect, it } from 'vitest';
import {
  purposeTokens,
  validateIndexHtml,
  validateManifest,
} from '../../scripts/lib/pwa-manifest-contract.mjs';

describe('pwa-manifest-contract helpers', () => {
  it('purposeTokens defaults to any when omitted', () => {
    expect([...purposeTokens(undefined)].sort()).toEqual(['any']);
    expect([...purposeTokens('maskable any')].sort()).toEqual([
      'any',
      'maskable',
    ]);
  });

  it('validateManifest rejects prefer_related_applications', () => {
    const result = validateManifest({
      name: 'Math Pentathlon',
      short_name: 'Math Pentathlon',
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'any',
      theme_color: '#102a43',
      background_color: '#102a43',
      lang: 'en',
      prefer_related_applications: true,
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512-maskable.png',
          sizes: '512x512',
          purpose: 'maskable',
        },
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join('\n')).toMatch(/prefer_related_applications/);
  });

  it('validateIndexHtml requires light and dark theme-color', () => {
    const bare = `<html><head>
      <meta name="theme-color" content="#102a43" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Math Pentathlon" />
      <link rel="apple-touch-icon" href="/icons/icon-180.png" />
    </head></html>`;
    const missing = validateIndexHtml(bare);
    expect(missing.ok).toBe(false);
    expect(missing.errors.join('\n')).toMatch(/prefers-color-scheme: light/);

    const full = `<html><head>
      <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#102a43" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#102a43" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Math Pentathlon" />
      <link rel="apple-touch-icon" href="/icons/icon-180.png" />
    </head></html>`;
    expect(validateIndexHtml(full)).toEqual({ ok: true, errors: [] });
  });
});
