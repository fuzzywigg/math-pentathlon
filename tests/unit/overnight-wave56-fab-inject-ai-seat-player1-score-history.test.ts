/**
 * Wave 56 leftover after #255/#256 — Fab AI-seat=player1 score/history CSS remaps. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — inject AI seat player1 score/history', () => {
  it('remaps score and history seats when AI is player1', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-score-p1'
    );
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-score-p2'
    );
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-history-player1'
    );
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-history-player2'
    );
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .fab-answer-player2'
    );
    expect(css).toContain('#ffcdd2');
    expect(css).toContain('#ddd6fe');
  });
});
