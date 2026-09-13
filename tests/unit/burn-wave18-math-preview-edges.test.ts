/**
 * Wave 18 — math / preview / attribute display edges under-hit by wave 16 place-score.
 * Tests-only. No product inventing. Avoid glued RNG around Pinball generateChallenge.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  calculateDivision,
  countOwnedIslands,
  rollDice as remRollDice,
  performRoll,
  previewDivision,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createPar,
  getAttributeDisplayName,
} from '../../src/games/par-55/rules';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  calculatePoints,
  checkWinner as contigWinner,
} from '../../src/games/contig-60/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { isGameOver as callaOver, getValidPits } from '../../src/games/calla/rules';

import {
  createInitialState as createPinball,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as startPin,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 18 math — Remainder Islands division table', () => {
  it('calculateDivision quotient/remainder table for small dividends', () => {
    const cases: Array<[number, number, number, number]> = [
      [7, 3, 2, 1],
      [12, 5, 2, 2],
      [10, 2, 5, 0],
      [5, 7, 0, 5],
      [9, 4, 2, 1],
    ];
    for (const [dividend, divisor, q, r] of cases) {
      const d = calculateDivision(dividend, divisor);
      expect(d.dividend).toBe(dividend);
      expect(d.divisor).toBe(divisor);
      expect(d.quotient).toBe(q);
      expect(d.remainder).toBe(r);
    }
  });

  it('rollDice faces are 1–6; countOwnedIslands after forced owners', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // die1 → 1
      .mockReturnValueOnce(0.99); // die2 → 6
    const roll = remRollDice();
    expect(roll.die1).toBeGreaterThanOrEqual(1);
    expect(roll.die1).toBeLessThanOrEqual(6);
    expect(roll.die2).toBeGreaterThanOrEqual(1);
    expect(roll.die2).toBeLessThanOrEqual(6);
    expect(roll.total).toBe(roll.die1 + roll.die2);

    const opening = createRemainder();
    expect(countOwnedIslands(opening)).toEqual({ player1: 0, player2: 0 });

    const islands = opening.islands.map((island, i) => ({
      ...island,
      owner: (i % 2 === 0 ? 'player1' : 'player2') as 'player1' | 'player2',
    }));
    const forced = { ...opening, islands };
    const counts = countOwnedIslands(forced);
    expect(counts.player1 + counts.player2).toBe(islands.length);
    expect(counts.player1).toBeGreaterThan(0);
    expect(counts.player2).toBeGreaterThan(0);
  });

  it('performRoll then previewDivision matches calculateDivision', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const rolled = performRoll(createRemainder());
    if (rolled.phase === 'selectIsland' && rolled.validIslands.length > 0) {
      const id = rolled.validIslands[0];
      const preview = previewDivision(rolled, id);
      expect(preview).not.toBeNull();
      const island = rolled.islands.find((i) => i.id === id)!;
      const expected = calculateDivision(rolled.currentRoll!.total, island.value);
      expect(preview).toEqual(expected);
    } else {
      // No valid islands — seat may have flipped; still a legal outcome
      expect(['rolling', 'selectIsland', 'gameOver']).toContain(rolled.phase);
    }
  });
});

describe('Wave 18 math — Par attribute display names', () => {
  it('maps known attrs; falls back to raw string', () => {
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('size')).toBe('Size');
    expect(getAttributeDisplayName('thickness')).toBe('Thickness');
    expect(getAttributeDisplayName('unknown-attr')).toBe('unknown-attr');
    // Smoke: opening state still constructible alongside helper
    expect(createPar().hands.player1.length).toBeGreaterThan(0);
  });
});

describe('Wave 18 math — Contig points / winner', () => {
  it('calculatePoints nonnegative; checkWinner null on fresh board', () => {
    const state = createContig();
    // cells Map is keyed by numeric value
    const values = [...state.cells.keys()].slice(0, 5);
    for (const v of values) {
      const pts = calculatePoints(state, v);
      expect(pts).toBeGreaterThanOrEqual(0);
    }
    expect(contigWinner(state)).toBeNull();
  });
});

describe('Wave 18 math — Calla isGameOver / pits', () => {
  it('opening not over with valid pits; gameOver phase / winner gates isGameOver', () => {
    const opening = createCalla();
    expect(callaOver(opening)).toBe(false);
    expect(getValidPits(opening).length).toBeGreaterThan(0);

    expect(
      callaOver({ ...opening, phase: 'gameOver', winner: 'player1' })
    ).toBe(true);
    expect(callaOver({ ...opening, winner: 'tie' })).toBe(true);
  });
});

describe('Wave 18 math — Pinball nextChallenge seat flip', () => {
  it('startGame then nextChallenge flips seat once without hanging', () => {
    // Real RNG for generateChallenge (distractor loops need entropy)
    const started = startPin(createPinball());
    expect(started.phase).toBe('answering');
    expect(started.currentChallenge).not.toBeNull();
    expect(started.currentPlayer).toBe('player1');

    const next = nextChallenge({
      ...started,
      phase: 'showingResult',
      selectedAnswer: started.currentChallenge!.answerChoices[0],
      isCorrect: false,
    });
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('answering');
    expect(next.roundNumber).toBe(started.roundNumber + 1);
    expect(next.currentChallenge).not.toBeNull();
  });
});
