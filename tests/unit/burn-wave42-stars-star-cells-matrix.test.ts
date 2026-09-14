/**
 * Wave 42 leftovers D — stars star cells matrix. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/stars-bars/types';
import { createInitialState } from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — star cells matrix', () => {
  it('isStar true only on corners and center via createInitialState', () => {
    const state = createInitialState();
    const stars = [
      [0, 0],
      [0, 4],
      [2, 2],
      [4, 0],
      [4, 4],
    ] as const;

    for (const [r, c] of stars) {
      expect(state.cells[r][c].isStar).toBe(true);
    }

    for (let r = 0; r < CONFIG.BOARD_SIZE; r++) {
      for (let c = 0; c < CONFIG.BOARD_SIZE; c++) {
        const shouldStar = stars.some(([sr, sc]) => sr === r && sc === c);
        expect(state.cells[r][c].isStar).toBe(shouldStar);
      }
    }
  });
});
