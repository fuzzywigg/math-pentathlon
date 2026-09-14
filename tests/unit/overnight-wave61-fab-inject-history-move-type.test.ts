/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab history-move type.
 * Wave56 pins list max-height; deepen move font-size/radius leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject history-move type', () => {
  it('history-move is 0.9rem with 4px radius', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-history-move');
    expect(css).toContain('font-size: 0.9rem');
    expect(css).toContain('border-radius: 4px');
  });
});
