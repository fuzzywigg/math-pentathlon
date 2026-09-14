/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab game-area gap/pad.
 * Wave56 pins max-width 1200; deepen gap/padding/margin leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject game-area gap pad', () => {
  it('game-area is column with 1rem gap/pad and centered margin', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-game-area');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('gap: 1rem');
    expect(css).toContain('padding: 1rem');
    expect(css).toContain('margin: 0 auto');
  });
});
