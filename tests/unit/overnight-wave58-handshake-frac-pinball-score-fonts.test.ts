/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — frac × pinball score font handshake.
 * Deepen shared 32px score-value leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 handshake — score-value 32px', () => {
  it('both engines lock score-value font-size 32px leftover', () => {
    injectFracFactStyles();
    injectFractionPinballStyles();
    const frac =
      document.getElementById('frac-fact-styles')!.textContent || '';
    const pin =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(frac).toMatch(/\.frac-score-value\s*\{[\s\S]*?font-size:\s*32px/);
    expect(pin).toMatch(
      /\.pinball-score-value\s*\{[\s\S]*?font-size:\s*32px/
    );
  });
});
