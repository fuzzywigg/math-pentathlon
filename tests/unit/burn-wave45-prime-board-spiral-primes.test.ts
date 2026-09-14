/**
 * Wave 45 — Prime Gold spiral board prime/Goldbach flags leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { CONFIG, isPrime } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — board flags', () => {
  it('7×7 spiral has 49 cells with consistent isPrime flags', () => {
    const state = createInitialState();
    expect(state.cells.size).toBe(CONFIG.BOARD_SIZE ** 2);
    for (const cell of state.cells.values()) {
      expect(cell.isPrime).toBe(isPrime(cell.value));
      if (cell.value % 2 === 0 && cell.value > 2 && cell.value < 20) {
        expect(cell.isGoldbachTarget).toBe(true);
      }
    }
  });
});
