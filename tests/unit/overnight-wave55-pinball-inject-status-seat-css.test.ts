/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball status seat CSS.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball inject — status seats', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes player status leftover colors', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-status.player1');
    expect(css).toContain('.pinball-status.player2');
    expect(css).toContain('#e3f2fd');
    expect(css).toContain('#ffebee');
  });
});
