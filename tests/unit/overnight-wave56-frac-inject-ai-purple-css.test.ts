/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact AI seat #ede9fe CSS.
 * Wave54/55 asserted selectors but not the purple fill. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — AI purple', () => {
  it('includes #ede9fe leftover on AI opponent status seats', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('#ede9fe');
    expect(css).toContain('[data-opponent="ai"] .frac-status.player2');
    expect(css).toContain(
      '[data-opponent="ai"][data-ai-seat="player1"] .frac-status.player1'
    );
  });
});
