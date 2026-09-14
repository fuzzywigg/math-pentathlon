/**
 * Wave 54 leftover after #240 — Pinball inject CSS leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — inject CSS', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes winner-banner gold and continue blue', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')?.textContent ?? '';
    expect(css).toContain('.pinball-winner-banner');
    expect(css).toContain('#ffd700');
    expect(css).toContain('.pinball-continue-btn');
    expect(css).toContain('#2196F3');
  });
});
