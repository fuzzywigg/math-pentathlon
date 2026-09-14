/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball correct feedback gradient CSS.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball inject — correct feedback', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes green gradient leftover', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-feedback.correct');
    expect(css).toContain('linear-gradient(135deg, #c8e6c9, #a5d6a7)');
    expect(css).toContain('.pinball-player-score.active');
    expect(css).toContain('.pinball-game-container');
  });
});
