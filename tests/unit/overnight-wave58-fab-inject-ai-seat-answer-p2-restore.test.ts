/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab AI-seat answer p2 restore.
 * Wave55 covered p2 under ai; wave57 score/history p1 seat; deepen answer p2 remap. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject ai-seat answer p2 restore', () => {
  it('player1 AI seat restores human red answer fill on player2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-answer-player2'
    );
    expect(css).toContain('background: #ffcdd2');
  });
});
