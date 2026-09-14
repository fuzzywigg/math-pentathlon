/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact final-score border-top.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — final-score border', () => {
  it('final-score seats use border-top 4px solid leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-final-score.player1');
    expect(css).toContain('border-top: 4px solid');
  });
});
