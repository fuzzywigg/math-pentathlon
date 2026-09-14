/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact status seat CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — status seats', () => {
  it('includes player status + AI seat player2 restore leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-status.player1');
    expect(css).toContain('.frac-status.player2');
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .frac-status.player2'
    );
    expect(css).toContain('#e3f2fd');
  });
});
