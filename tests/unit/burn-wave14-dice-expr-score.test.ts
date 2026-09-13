import { describe, it, expect } from 'vitest';

import {
  createInitialState as createContig,
  getAllPossibleResults,
  getAdjacentPositions,
  CONFIG as CONTIG_CFG,
} from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

import {
  factorial,
  isPrime,
  isGoldbachNumber,
  generateExpressions,
} from '../../src/games/prime-gold/types';

import {
  getDiceSum,
  rollDice as rollSumDice,
} from '../../src/games/sum-dominoes/types';

import {
  getShapesForDie,
  getCategoryFromDie,
} from '../../src/games/juggle/types';
import {
  createInitialState as createJuggle,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG as JUGGLE_CFG } from '../../src/games/juggle/types';

import {
  countDifferences,
  getDifferenceDescription,
  AttributeCard,
} from '../../src/games/stars-bars/types';

import { isWinningValue } from '../../src/games/kwatro-sinko/types';

import {
  createInitialState as createRemainder,
  getPlayerScore,
  getPlayerChips,
} from '../../src/games/remainder-islands/types';

import {
  createKing,
  createQuadraphage,
} from '../../src/games/kings-quadraphages/pieces';

describe('Wave 14 — Contig dice / adjacency / scoring', () => {
  it('getAllPossibleResults includes products and sums for [2,3,4]', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    const values = results.map((r) => r.result);
    expect(values).toEqual(expect.arrayContaining([24, 9, 5, 6]));
    expect(
      results.every((r) => Number.isInteger(r.result) && r.result > 0)
    ).toBe(true);
    expect(results.every((r) => r.expression.includes('2'))).toBe(true);
  });

  it('getAdjacentPositions counts match corner / edge / center', () => {
    expect(getAdjacentPositions(0, 0)).toHaveLength(3);
    expect(getAdjacentPositions(0, 5)).toHaveLength(5);
    expect(
      getAdjacentPositions(
        Math.floor(CONTIG_CFG.GRID_ROWS / 2),
        Math.floor(CONTIG_CFG.GRID_COLS / 2)
      ).length
    ).toBe(8);
    expect(
      getAdjacentPositions(CONTIG_CFG.GRID_ROWS - 1, CONTIG_CFG.GRID_COLS - 1)
    ).toHaveLength(3);
  });

  it('calculatePoints is 0 isolated and >0 with owned neighbors', () => {
    const state = createContig();
    const value = state.grid[2][2]!;
    expect(calculatePoints(state, value)).toBe(0);

    const cell = state.cells.get(value)!;
    const adj = getAdjacentPositions(cell.row, cell.col)[0];
    const adjValue = state.grid[adj.row][adj.col]!;
    const owned = state.cells.get(adjValue)!;
    owned.owner = 'player1';
    expect(calculatePoints(state, value)).toBeGreaterThan(0);
    expect(calculatePoints(state, 99999)).toBe(0);
  });
});

describe('Wave 14 — Prime Gold factorial / prime / Goldbach / expressions', () => {
  it('factorial edges and primes / Goldbach', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(Number.isNaN(factorial(-1))).toBe(true);
    expect(Number.isNaN(factorial(11))).toBe(true);

    expect(isPrime(2)).toBe(true);
    expect(isPrime(17)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(9)).toBe(false);

    expect(isGoldbachNumber(10)).toBe(true);
    expect(isGoldbachNumber(4)).toBe(true);
    expect(isGoldbachNumber(3)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
  });

  it('generateExpressions for 2,3,4 includes sum and products', () => {
    const exprs = generateExpressions(2, 3, 4);
    const values = exprs.map((e) => e.value);
    expect(values).toEqual(expect.arrayContaining([2, 3, 4, 9, 24]));
    expect(exprs.some((e) => e.expr.includes('+'))).toBe(true);
    expect(
      exprs.some((e) => e.expr.includes('×') || e.expr.includes('*'))
    ).toBe(true);
    expect(exprs.every((e) => e.value > 0 && e.value <= 49)).toBe(true);
  });
});

describe('Wave 14 — Sum dice / Juggle pools / board fill', () => {
  it('getDiceSum and rollDice stay in 1–6', () => {
    expect(getDiceSum([2, 5])).toBe(7);
    expect(getDiceSum([6, 6])).toBe(12);
    for (let i = 0; i < 20; i++) {
      const [a, b] = rollSumDice();
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(6);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(6);
    }
  });

  it('getShapesForDie aligns with getCategoryFromDie; unknown → monomino', () => {
    for (let die = 1; die <= 6; die++) {
      const category = getCategoryFromDie(die);
      const shapes = getShapesForDie(die);
      expect(shapes.length).toBeGreaterThan(0);
      if (category === 'monomino') {
        expect(shapes.every((s) => s.size === 1)).toBe(true);
      }
      if (category === 'domino') {
        expect(shapes.every((s) => s.size === 2)).toBe(true);
      }
    }
    expect(getCategoryFromDie(0)).toBe('monomino');
    expect(getShapesForDie(0).every((s) => s.size === 1)).toBe(true);
  });

  it('getBoardFillPercentage mid-fill ≈ 50', () => {
    const empty = createJuggle().boards.player1;
    expect(getBoardFillPercentage(empty)).toBe(0);

    const half = createBoard(JUGGLE_CFG.GRID_SIZE, JUGGLE_CFG.GRID_SIZE);
    const total = JUGGLE_CFG.GRID_SIZE * JUGGLE_CFG.GRID_SIZE;
    const fillCount = Math.floor(total / 2);
    let filled = 0;
    for (let r = 0; r < JUGGLE_CFG.GRID_SIZE && filled < fillCount; r++) {
      for (let c = 0; c < JUGGLE_CFG.GRID_SIZE && filled < fillCount; c++) {
        half.cells[r][c] = true;
        filled++;
      }
    }
    expect(getBoardFillPercentage(half)).toBe(
      Math.round((fillCount / total) * 100)
    );
  });
});

describe('Wave 14 — Stars differences / Kwatro / Remainder scores / Kings pieces', () => {
  const card = (
    shape: AttributeCard['shape'],
    color: AttributeCard['color'],
    size: AttributeCard['size'],
    thickness: AttributeCard['thickness']
  ): AttributeCard => ({
    id: `${shape}-${color}-${size}-${thickness}`,
    shape,
    color,
    size,
    thickness,
  });

  it('countDifferences and getDifferenceDescription', () => {
    const a = card('circle', 'red', 'small', 'thin');
    const same = card('circle', 'red', 'small', 'thin');
    const allDiff = card('square', 'blue', 'large', 'thick');
    expect(countDifferences(a, same)).toBe(0);
    expect(getDifferenceDescription(a, same)).toBe('');
    expect(countDifferences(a, allDiff)).toBe(4);
    const desc = getDifferenceDescription(a, allDiff);
    expect(desc).toContain('shape');
    expect(desc).toContain('color');
    expect(desc).toContain('size');
    expect(desc).toContain('thickness');
  });

  it('isWinningValue only 4 and 5', () => {
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(0)).toBe(false);
    expect(isWinningValue(6)).toBe(false);
  });

  it('remainder seats keep independent chips and scores', () => {
    const state = {
      ...createRemainder(),
      player1Chips: 9,
      player2Chips: 4,
      player1Score: 12,
      player2Score: 3,
    };
    expect(getPlayerChips(state, 'player1')).toBe(9);
    expect(getPlayerChips(state, 'player2')).toBe(4);
    expect(getPlayerScore(state, 'player1')).toBe(12);
    expect(getPlayerScore(state, 'player2')).toBe(3);
  });

  it('createKing / createQuadraphage set type and owner', () => {
    expect(createKing('player1')).toEqual({ type: 'king', owner: 'player1' });
    expect(createQuadraphage('player2')).toEqual({
      type: 'quadraphage',
      owner: 'player2',
    });
  });
});
