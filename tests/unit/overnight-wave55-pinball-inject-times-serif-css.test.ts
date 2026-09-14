/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball Times New Roman fraction CSS.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball inject — serif fraction', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes Times New Roman leftover on .pinball-fraction', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-fraction');
    expect(css).toContain("font-family: 'Times New Roman', serif");
    expect(css).toContain('.pinball-instruction');
  });
});
