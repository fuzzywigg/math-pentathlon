/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab history seat fills.
 * Distinct from AI-seat paths; deepen human history-player fills. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject history seat fills', () => {
  it('history-player1/2 use #bbdefb / #ffcdd2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-history-player1');
    expect(css).toContain('.fab-history-player2');
    expect(css).toContain('background: #bbdefb');
    expect(css).toContain('background: #ffcdd2');
  });
});
