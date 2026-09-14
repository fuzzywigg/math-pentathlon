/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab main-layout gap chrome.
 * Wave55 asserts 1fr 300px columns; deepen gap: 1.5rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject main-layout gap', () => {
  it('main-layout uses 1.5rem gap beside 300px sidebar', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-main-layout');
    expect(css).toContain('grid-template-columns: 1fr 300px');
    expect(css).toContain('gap: 1.5rem');
  });
});
