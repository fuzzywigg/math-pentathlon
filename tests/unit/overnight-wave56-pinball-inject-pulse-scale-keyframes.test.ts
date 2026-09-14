/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball pulse keyframe bodies.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — pulse keyframes', () => {
  it('pulse keyframes scale 1 to 1.2 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('@keyframes pulse');
    expect(css).toContain('from { transform: scale(1); }');
    expect(css).toContain('to { transform: scale(1.2); }');
  });
});
