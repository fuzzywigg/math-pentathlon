/**
 * Wave 57 leftover after #257 — Fab winner gradient + seat color vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — inject winner gradient seat vars', () => {
  it('includes gold gradient and player color CSS vars', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffec8b)');
    expect(css).toContain('var(--color-player1, #2196f3)');
    expect(css).toContain('var(--color-player2, #f44336)');
  });
});
