/**
 * Wave 68 leftover after tip/#336 — Kwatro selectable-chip hover scale scoped.
 * Wave60 soft scale; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject selectable chip hover scale scoped', () => {
  it('selectable-chip:hover uses scale 1.1', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-selectable-chip:hover\s*\{[\s\S]*?transform:\s*scale\(1\.1\)/);
  });
});
