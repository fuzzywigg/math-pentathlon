/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab AI-seat score p2 restore.
 * Wave58 restored answer p2; deepen score-p2 #ffcdd2 remap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject ai-seat score p2 restore', () => {
  it('player1 AI seat restores human red score fill on player2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-score-p2'
    );
    expect(css).toContain('background: #ffcdd2');
  });
});
