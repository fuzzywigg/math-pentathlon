/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab selected ring + op-valid fills.
 * Wave57 covered #fff3e0 selected fill; deepen COLORS.selected/valid literals. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject selected ring op-valid', () => {
  it('selected ring uses #ff9800 and op-valid uses green tokens', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('box-shadow: 0 0 0 2px #ff9800');
    expect(css).toContain('.fab-op-valid');
    expect(css).toContain('border-color: #4caf50');
    expect(css).toContain('background: #c8e6c9');
  });
});
