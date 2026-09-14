/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball @keyframes pulse CSS.
 * Wave54 sampled winner-banner, not pulse. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball inject — pulse keyframes', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes pulse animation leftovers', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('@keyframes pulse');
    expect(css).toContain('animation: pulse 0.5s ease-in-out infinite alternate');
    expect(css).toContain('.pinball-animation');
  });
});
