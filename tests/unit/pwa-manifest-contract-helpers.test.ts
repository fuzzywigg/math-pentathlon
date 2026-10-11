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

  it('validateIndexHtml accepts apple-touch-icon when href precedes rel', () => {
    const chrome = `
      <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#102a43" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#102a43" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Math Pentathlon" />`;

    const attributeOrders = [
      // rel then href (live index.html order)
      `<link rel="apple-touch-icon" href="/icons/icon-180.png" />`,
      // href before rel (ticket baseline)
      `<link href="/icons/icon-180.png" rel="apple-touch-icon" />`,
      // single quotes, href first
      `<link href='/icons/icon-180.png' rel='apple-touch-icon' />`,
      // single quotes, rel first
      `<link rel='apple-touch-icon' href='/icons/icon-180.png' />`,
    ];

    for (const icon of attributeOrders) {
      const html = `<html><head>${chrome}${icon}</head></html>`;
      expect(validateIndexHtml(html)).toEqual({ ok: true, errors: [] });
    }

    const wrongHref = `<html><head>${chrome}
      <link href="/icons/wrong.png" rel="apple-touch-icon" />
    </head></html>`;
    const wrong = validateIndexHtml(wrongHref);
    expect(wrong.ok).toBe(false);
    expect(wrong.errors.join('\n')).toMatch(
      /missing apple-touch-icon \/icons\/icon-180\.png/
    );
  });

  it('validateIndexHtml accepts theme-color when media/content precede name', () => {
    const chrome = `
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Math Pentathlon" />
      <link rel="apple-touch-icon" href="/icons/icon-180.png" />`;
    const fallback = `<meta name="theme-color" content="#102a43" />`;

    const attributeOrders = [
      // media before name (ticket baseline)
      `<meta media="(prefers-color-scheme: light)" name="theme-color" content="#f8fafc" />
       <meta media="(prefers-color-scheme: dark)" name="theme-color" content="#102a43" />`,
      // media + content before name
      `<meta media="(prefers-color-scheme: light)" content="#f8fafc" name="theme-color" />
       <meta media="(prefers-color-scheme: dark)" content="#102a43" name="theme-color" />`,
      // content before name
      `<meta content="#f8fafc" name="theme-color" media="(prefers-color-scheme: light)" />
       <meta content="#102a43" name="theme-color" media="(prefers-color-scheme: dark)" />`,
      // content + media before name
      `<meta content="#f8fafc" media="(prefers-color-scheme: light)" name="theme-color" />
       <meta content="#102a43" media="(prefers-color-scheme: dark)" name="theme-color" />`,
      // name first (still green)
      `<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
       <meta name="theme-color" content="#102a43" media="(prefers-color-scheme: dark)" />`,
      // name + media before content
      `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8fafc" />
       <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#102a43" />`,
    ];

    for (const themes of attributeOrders) {
      const html = `<html><head>${themes}${fallback}${chrome}</head></html>`;
      expect(validateIndexHtml(html)).toEqual({ ok: true, errors: [] });
    }

    const wrongColors = `<html><head>
      <meta media="(prefers-color-scheme: light)" name="theme-color" content="#ffffff" />
      <meta media="(prefers-color-scheme: dark)" name="theme-color" content="#000000" />
      ${fallback}${chrome}
    </head></html>`;
    const wrong = validateIndexHtml(wrongColors);
    expect(wrong.ok).toBe(false);
    expect(wrong.errors.join('\n')).toMatch(/prefers-color-scheme: light/);
    expect(wrong.errors.join('\n')).toMatch(/prefers-color-scheme: dark/);
  });
});
