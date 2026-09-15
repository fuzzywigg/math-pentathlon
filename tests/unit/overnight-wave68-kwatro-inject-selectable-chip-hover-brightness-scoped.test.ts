/**
 * Wave 68 leftover after tip/#336 — Kwatro selectable-chip hover brightness scoped.
 * Wave60 soft brightness; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject selectable chip hover brightness scoped', () => {
  it('selectable-chip:hover uses brightness 1.1', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-selectable-chip:hover\s*\{[\s\S]*?filter:\s*brightness\(1\.1\)/);
  });
});
