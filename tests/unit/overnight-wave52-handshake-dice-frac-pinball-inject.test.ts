/**
 * Overnight HEAVY leftover after #234 — inject style ids for dice/frac/pinball.
 * Distinct from wave50/51 hex inject sets. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import { injectFractionBarStyles } from '../../src/core/fractions/fraction-bar-ui';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  for (const id of [
    'dice-selector-styles',
    'fraction-bar-styles',
    'frac-fact-styles',
    'fraction-pinball-styles',
  ]) {
    document.getElementById(id)?.remove();
  }
});

describe('Wave 52 handshake — inject ids', () => {
  it('stamps distinct style element ids once each', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root);
    injectFractionBarStyles();
    injectFracFactStyles();
    injectFractionPinballStyles();
    injectFractionBarStyles();
    injectFracFactStyles();
    injectFractionPinballStyles();
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();
    expect(document.getElementById('fraction-bar-styles')).toBeTruthy();
    expect(document.getElementById('frac-fact-styles')).toBeTruthy();
    expect(document.getElementById('fraction-pinball-styles')).toBeTruthy();
    expect(document.querySelectorAll('#frac-fact-styles').length).toBe(1);
    expect(document.querySelectorAll('#fraction-pinball-styles').length).toBe(1);
    sel.destroy();
  });
});
