/**
 * Wave 68 leftover after tip/#336 — Kwatro svg display block scoped.
 * Wave63 soft display; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject svg display block scoped', () => {
  it('svg uses display block', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-svg\s*\{[\s\S]*?display:\s*block/);
  });
});
