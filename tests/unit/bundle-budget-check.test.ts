import { describe, it, expect } from 'vitest';
import {
  parseMenuCriticalRefs,
  mapGameChunks,
} from '../../scripts/check-bundle-budgets.mjs';

describe('bundle budget helpers', () => {
  it('parses menu JS/CSS refs from index.html', () => {
    const html = `
      <script type="module" src="/assets/index-abc12345.js"></script>
      <link rel="modulepreload" href="/vendor/vite-preload-abc12345.js">
      <link rel="modulepreload" href="/assets/core-abc12345.js">
      <link rel="modulepreload" href="/assets/ui-abc12345.js">
      <link rel="stylesheet" href="/assets/ui-abc12345.css">
      <link rel="stylesheet" href="/assets/index-abc12345.css">
      <link rel="manifest" href="/site.webmanifest">
      <link rel="preload" href="/fonts/inter.woff2" as="font">
    `;
    expect(parseMenuCriticalRefs(html)).toEqual([
      'assets/core-abc12345.js',
      'assets/index-abc12345.css',
      'assets/index-abc12345.js',
      'assets/ui-abc12345.css',
      'assets/ui-abc12345.js',
      'vendor/vite-preload-abc12345.js',
    ]);
  });

  it('maps game chunks without short-id stealing longer names', () => {
    const files = [
      'game-hex-aaaaaaaa.js',
      'game-hex-a-gone-bbbbbbbb.js',
      'game-queens-guards--cccccccc.js',
    ];
    const map = mapGameChunks(files, ['hex', 'hex-a-gone', 'queens-guards']);
    expect(map.get('hex')).toBe('game-hex-aaaaaaaa.js');
    expect(map.get('hex-a-gone')).toBe('game-hex-a-gone-bbbbbbbb.js');
    expect(map.get('queens-guards')).toBe('game-queens-guards--cccccccc.js');
  });
});
