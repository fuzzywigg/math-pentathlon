import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  getAllPossibleResults,
  getValidPlacements as getContigPlacements,
} from '../../src/games/contig-60/types';

import {
  generateExpressions,
  factorial,
  isPrime,
  isGoldbachNumber,
} from '../../src/games/prime-gold/types';
import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as getPrimePlacements,
} from '../../src/games/prime-gold/rules';

import {
  createInitialState as createSum,
  canPlayDomino,
  isValidPlacement,
  getValidPlacements as getSumPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  getDiceSum,
  isDouble,
  getDominoPips,
  createDominoSet,
} from '../../src/games/sum-dominoes/types';

import {
  getCategoryFromDie,
  getShapesForDie,
  rollDice as juggleDice,
} from '../../src/games/juggle/types';
import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  isPlacementValid,
} from '../../src/games/juggle/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  rollDice as remainderDice,
} from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 12 — Contig dice expression contracts', () => {
  it('getAllPossibleResults for [2,3,6] includes (2+3)*6 and rejects non-int ÷', () => {
    const results = getAllPossibleResults([2, 3, 6]);
    const exprs = results.map((r) => r.expression);
    expect(results.some((r) => r.result === 30)).toBe(true);
    expect(exprs.some((e) => e.includes('(2 + 3)') && e.includes('6'))).toBe(
      true
    );
    // Non-integer division never appears as a result
    for (const r of results) {
      expect(Number.isInteger(r.result)).toBe(true);
      expect(r.result).toBeGreaterThan(0);
    }
  });

  it('getValidPlacements only returns unowned board numbers', () => {
    let state = createContig();
    const dice: [number, number, number] = [2, 3, 6];
    const all = getAllPossibleResults(dice);
    // Own one possible result if present on board
    const ownedHit = all.find((r) => state.cells.has(r.result));
    if (ownedHit) {
      const cells = new Map(state.cells);
      cells.set(ownedHit.result, {
        ...cells.get(ownedHit.result)!,
        owner: 'player1',
      });
      state = { ...state, cells };
    }
    const valid = getContigPlacements(state, dice);
    for (const v of valid) {
      expect(state.cells.get(v.result)?.owner).toBeNull();
    }
    if (ownedHit) {
      expect(valid.every((v) => v.result !== ownedHit.result)).toBe(true);
    }
  });

  it('getAllPossibleResults for [1,1,1] stays small positive integers', () => {
    const results = getAllPossibleResults([1, 1, 1]);
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((r) => r.result >= 1 && Number.isInteger(r.result))
    ).toBe(true);
  });
});

describe('Wave 12 — Prime Gold expression / dice contracts', () => {
  it('factorial edges and isPrime / isGoldbachNumber helpers', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(Number.isNaN(factorial(11))).toBe(true);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isGoldbachNumber(10)).toBe(true);
    expect(isGoldbachNumber(3)).toBe(false);
  });

  it('generateExpressions(2,3,4) stays ≤49 and includes × / ^ / ! paths', () => {
    const exprs = generateExpressions(2, 3, 4);
    expect(exprs.length).toBeGreaterThan(5);
    expect(exprs.every((e) => e.value > 0 && e.value <= 49)).toBe(true);
    const joined = exprs.map((e) => e.expr).join(' ');
    expect(joined).toMatch(/×|\^|!/);
  });

  it('after mocked roll, getValidPlacements only empty cells', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createPrime();
    state = primeRoll(state);
    const placements = getPrimePlacements(state);
    for (const p of placements) {
      const cell = [...state.cells.values()].find((c) => c.value === p.value);
      expect(cell?.owner ?? null).toBeNull();
    }
  });
});

describe('Wave 12 — Sum Dominoes dice / placement matrix', () => {
  it('getDiceSum / isDouble / getDominoPips helpers', () => {
    expect(getDiceSum([3, 4])).toBe(7);
    expect(
      isDouble({
        id: 'd',
        face1: 5,
        face2: 5,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(true);
    expect(
      isDouble({
        id: 'd',
        face1: 5,
        face2: 4,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(false);
    expect(
      getDominoPips({
        id: 'd',
        face1: 3,
        face2: 4,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(7);
  });

  it('createDominoSet has 28 tiles; canPlayDomino / isValidPlacement agree', () => {
    expect(createDominoSet()).toHaveLength(28);
    const state = createSum();
    const sum = 7;
    const playable = state.hands.player1.filter((d) =>
      canPlayDomino(state, d, sum)
    );
    for (const d of playable) {
      const spots = getSumPlacements(state, d, sum);
      expect(spots.length).toBeGreaterThan(0);
      const spot = spots[0]!;
      expect(
        isValidPlacement(state, d, spot.position, spot.orientation, sum)
      ).toBe(true);
    }
  });
});

describe('Wave 12 — Juggle die category / shapes / placement gate', () => {
  it('getCategoryFromDie and getShapesForDie map 1–6', () => {
    expect(getCategoryFromDie(1)).toBe('monomino');
    expect(getCategoryFromDie(4)).toBe('tetromino');
    expect(getCategoryFromDie(6)).toBe('pentomino');
    expect(getShapesForDie(1).length).toBeGreaterThan(0);
    expect(getShapesForDie(4).every((s) => s.size === 4)).toBe(true);
  });

  it('rollDice returns two faces; selectDie gates placement until shape chosen', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const dice = juggleDice();
    expect(dice).toHaveLength(2);
    let state = createJuggle();
    state = juggleRoll(state);
    expect(state.phase).toBe('selectingShape');
    state = selectDie(state, 0);
    // monomino (die=1 from random 0) auto-selects into placing
    expect(['placing', 'selectingShape']).toContain(state.phase);
    if (state.phase === 'placing') {
      expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    }
  });
});

describe('Wave 12 — Remainder Islands roll → valid islands', () => {
  it('rollDice totals die1+die2; performRoll yields non-empty valid islands', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const roll = remainderDice();
    expect(roll.total).toBe(roll.die1 + roll.die2);
    expect(roll.die1).toBeGreaterThanOrEqual(1);
    expect(roll.die2).toBeLessThanOrEqual(6);

    let state = createRemainder();
    state = performRoll(state);
    if (state.phase === 'selectIsland') {
      expect(state.validIslands.length).toBeGreaterThan(0);
      const found = findValidIslands(state, state.currentRoll!.total);
      expect(found).toEqual(state.validIslands);
    } else {
      // Auto-skip path still keeps rolling phase
      expect(state.phase).toBe('rolling');
    }
  });
});
