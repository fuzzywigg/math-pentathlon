/**
 * Overnight HEAVY leftover after #234 — opening mounts for dice/frac/pinball.
 * Distinct from open #235/#236 hex mounts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';
import { createFraction } from '../../src/core/fractions/arithmetic';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { startGame as startFrac } from '../../src/games/frac-fact/rules';
import {
  renderProblem,
  renderScores as fracScores,
} from '../../src/games/frac-fact/board-ui';
import { createInitialState as pinInit } from '../../src/games/fraction-pinball/types';
import { startGame as startPin } from '../../src/games/fraction-pinball/rules';
import {
  renderChallenge,
  renderPinballBoard,
  renderScores as pinScores,
} from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('dice-selector-styles')?.remove();
});

describe('Wave 52 handshake — opening mounts', () => {
  it('mounts dice selector, frac bar/problem, and pinball board chrome', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root);
    expect(root.classList.contains('dice-selector')).toBe(true);
    expect(root.querySelector('.dice-btn-primary')?.textContent).toMatch(/Roll/);

    const bar = renderHorizontalBar(createFraction(1, 2));
    expect(bar.classList.contains('fraction-bar-horizontal')).toBe(true);

    const frac = startFrac(fracInit('easy'));
    expect(renderProblem(frac).querySelector('.frac-problem-display')).toBeTruthy();
    expect(fracScores(frac).querySelector('.frac-progress-text')?.textContent).toMatch(
      /Problem 1 of/
    );

    const pin = startPin(pinInit());
    expect(renderChallenge(pin, () => undefined).querySelector('.pinball-question')).toBeTruthy();
    expect(renderPinballBoard(pin).classList.contains('pinball-board')).toBe(true);
    expect(pinScores(pin).querySelector('.pinball-round-value')).toBeTruthy();
    sel.destroy();
  });
});
