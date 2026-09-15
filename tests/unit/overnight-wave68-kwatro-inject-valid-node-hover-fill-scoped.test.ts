/**
 * Wave 68 leftover after tip/#336 — Kwatro valid-node hover fill scoped.
 * Wave60 soft hover fill; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject valid node hover fill scoped', () => {
  it('valid-node:hover uses fill a5d6a7 important', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-valid-node:hover\s*\{[\s\S]*?fill:\s*#a5d6a7 !important/);
  });
});
