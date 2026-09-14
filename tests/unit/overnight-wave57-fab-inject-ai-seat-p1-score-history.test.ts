/**
 * Wave 57 leftover after #257 — Fab AI-seat p1 score/history remaps. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — inject ai-seat p1 score history', () => {
  it('includes player1 seat score/history remaps distinct from wave55 p2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-score-p1'
    );
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-history-player1'
    );
    expect(css).toContain('#ddd6fe');
  });
});
