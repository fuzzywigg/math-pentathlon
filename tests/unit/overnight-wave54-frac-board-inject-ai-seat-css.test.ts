/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact inject CSS AI-seat / hover leftovers.
 * Distinct from wave50 inject id idempotency. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 54 frac board-ui — inject AI seat CSS', () => {
  it('stylesheet includes AI opponent seat + choice hover leftovers', () => {
    injectFracFactStyles();
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(document.querySelectorAll('#frac-fact-styles')).toHaveLength(1);
    expect(css).toContain('[data-opponent="ai"] .frac-status.player2');
    expect(css).toContain('[data-ai-seat="player1"]');
    expect(css).toContain('.frac-choice-btn:hover');
    expect(css).toContain('.frac-btn-primary');
    expect(css).toContain('.frac-answer-box.incorrect');
  });
});
