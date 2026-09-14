/**
 * Wave 42 — Pentomino catalog × Prime Gold math helpers handshake after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState as createPent,
  getPentominoShape,
  PIECES_PER_PLAYER,
  BOARD_SIZE,
} from '../../src/games/pent-em-in/types';
import {
  isPrime,
  factorial,
  generateExpressions,
  CONFIG as PRIME_CONFIG,
} from '../../src/games/prime-gold/types';
import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';

describe('Wave 42 handshake — pent × prime math', () => {
  it('each seat starts with PIECES_PER_PLAYER known pentomino ids', () => {
    const state = createPent();
    expect(state.player1Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player2Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    for (const id of state.player1Pieces.available) {
      expect(getPentominoShape(id)).toBeDefined();
    }
    expect(BOARD_SIZE).toBe(10);
  });

  it('prime spiral board values 1..49 and CONFIG veins ladder', () => {
    const state = createPrime();
    const values = [...state.cells.values()].map((c) => c.value).sort((a, b) => a - b);
    expect(values).toEqual(Array.from({ length: 49 }, (_, i) => i + 1));
    expect(PRIME_CONFIG.BOARD_SIZE).toBe(7);
    expect(PRIME_CONFIG.VEINS_TO_WIN).toBeGreaterThanOrEqual(1);
    expect(PRIME_CONFIG.MIN_VEIN_LENGTH).toBeGreaterThanOrEqual(3);
  });

  it('isPrime / factorial / generateExpressions stay in board bounds', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(factorial(4)).toBe(24);
    expect(Number.isNaN(factorial(11))).toBe(true);
    const exprs = generateExpressions(2, 3, 4);
    expect(exprs.length).toBeGreaterThan(0);
    for (const e of exprs) {
      expect(e.value).toBeGreaterThan(0);
      expect(e.value).toBeLessThanOrEqual(49);
      expect(Number.isInteger(e.value)).toBe(true);
    }
  });
});
