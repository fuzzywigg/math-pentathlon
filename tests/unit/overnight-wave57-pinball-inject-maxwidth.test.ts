/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball container max-width CSS.
 * Wave55 asserted frac max-width 800px; pinball twin unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — maxwidth', () => {
  it('includes .pinball-game-container max-width 800px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-game-container');
    expect(css).toContain('max-width: 800px');
  });
});
