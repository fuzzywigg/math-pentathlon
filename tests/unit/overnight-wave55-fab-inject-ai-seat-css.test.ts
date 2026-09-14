/**
 * Wave 55 leftover after #249/#250 — Fab AI-seat CSS chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — inject AI seat CSS', () => {
  it('includes opponent=ai seat remaps and violet fill', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('[data-opponent="ai"] .fab-answer-player2');
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-answer-player1'
    );
    expect(css).toContain('[data-opponent="ai"] .fab-score-p2');
    expect(css).toContain('[data-opponent="ai"] .fab-history-player2');
    expect(css).toContain('#ddd6fe');
  });
});
