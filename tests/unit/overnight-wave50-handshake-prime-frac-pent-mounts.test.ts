/**
 * Overnight HEAVY leftover after #229 — Handshake opening mounts prime/frac/pent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { startGame } from '../../src/games/frac-fact/rules';
import {
  renderBoard as renderPrime,
  renderDice,
  renderScores as primeScores,
} from '../../src/games/prime-gold/board-ui';
import {
  renderProblem,
  renderAnswerChoices,
  renderScores as fracScores,
} from '../../src/games/frac-fact/board-ui';
import {
  renderBoard as renderPent,
  renderPieceSelector,
} from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 handshake — opening mounts', () => {
  it('mounts core chrome for prime, frac, and pent openings', () => {
    const prime = primeInit();
    expect(renderPrime(prime, () => undefined).querySelectorAll('.pg-cell').length).toBe(49);
    expect(renderDice(prime, () => undefined).querySelector('.pg-roll-btn')).toBeTruthy();
    expect(primeScores(prime).querySelector('.pg-score.player1')).toBeTruthy();

    const frac = startGame(fracInit('easy'));
    expect(renderProblem(frac).querySelector('.frac-problem-display')).toBeTruthy();
    expect(renderAnswerChoices(frac, () => undefined).querySelectorAll('.frac-choice-btn').length).toBeGreaterThan(0);
    expect(fracScores(frac).querySelector('.frac-progress-text')?.textContent).toMatch(/Problem 1 of/);

    const pent = pentInit();
    expect(renderPent(pent, () => undefined, () => undefined).classList.contains('pent-board')).toBe(true);
    expect(renderPieceSelector(pent, () => undefined).querySelectorAll('.pent-piece-option').length).toBe(12);
  });
});
