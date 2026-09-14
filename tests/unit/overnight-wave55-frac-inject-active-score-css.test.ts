/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact active score scale CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — active score', () => {
  it('includes active scale + progress bar leftovers', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-player-score.active');
    expect(css).toContain('transform: scale(1.05)');
    expect(css).toContain('.frac-progress-bar');
    expect(css).toContain('.frac-final-score.player1');
  });
});
