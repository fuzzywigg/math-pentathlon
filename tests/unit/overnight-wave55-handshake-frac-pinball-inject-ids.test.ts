/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — frac-fact × pinball inject style ids leftover.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 55 handshake — inject ids', () => {
  it('mounts both stylesheets leftover', () => {
    injectFracFactStyles();
    injectFractionPinballStyles();
    expect(document.getElementById('frac-fact-styles')).toBeTruthy();
    expect(document.getElementById('fraction-pinball-styles')).toBeTruthy();
  });
});
