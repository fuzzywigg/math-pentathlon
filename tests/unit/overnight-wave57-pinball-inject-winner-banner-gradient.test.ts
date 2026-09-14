/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball winner banner full gold gradient.
 * Wave55 covered frac twin; pinball overnight never asserted #ffb700 pair. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — winner banner gradient', () => {
  it('includes exact gold linear-gradient leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffb700)');
  });
});
