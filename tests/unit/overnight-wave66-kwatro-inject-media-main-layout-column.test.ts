/**
 * Wave 66 leftover after tip/#316 — Kwatro media main-layout column scoped.
 * Wave63 soft flex-direction; deepen media-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject media main-layout column', () => {
  it('768px media forces main-layout column', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(
      /@media \(max-width: 768px\)\s*\{[\s\S]*?\.kwa-main-layout\s*\{[\s\S]*?flex-direction:\s*column/
    );
  });
});
