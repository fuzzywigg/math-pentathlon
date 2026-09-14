/**
 * Wave 41 — Stars & Bars getValidPlacements empty vs seeded leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getValidPlacements,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { CONFIG, type StarsState } from '../../src/games/stars-bars/types';

describe('Wave 41 stars — valids empty vs seed', () => {
  it('empty board yields every cell as valid', () => {
    const state = createInitialState();
    const valids = getValidPlacements(state);
    expect(valids).toHaveLength(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    expect(valids).toContainEqual({ row: 0, col: 0 });
    expect(valids).toContainEqual({ row: 4, col: 4 });
  });

  it('after seed only empties adjacent (incl. diagonal) remain valid', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    expect(state.cells[2][2].card).toBeTruthy();

    const valids = getValidPlacements(state);
    expect(valids.length).toBeLessThan(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    expect(valids).not.toContainEqual({ row: 2, col: 2 });
    // Orthogonal/diagonal neighbors of center
    expect(valids).toContainEqual({ row: 1, col: 1 });
    expect(valids).toContainEqual({ row: 2, col: 3 });
    // Far corner not adjacent to center
    expect(valids).not.toContainEqual({ row: 0, col: 0 });
  });

  it('seeded board with all neighbors filled yields empty valids', () => {
    const state = createInitialState();
    const cells = state.cells.map((row) =>
      row.map((c) => ({ ...c, card: null as StarsState['cells'][0][0]['card'] }))
    );
    const seed = state.playerHands.player1[0];
    // Fill everything except leave structure: one card at (0,0) and all others occupied
    // so no empty adjacent slots remain
    for (let r = 0; r < CONFIG.BOARD_SIZE; r++) {
      for (let c = 0; c < CONFIG.BOARD_SIZE; c++) {
        cells[r][c] = {
          ...cells[r][c],
          card: { ...seed, id: `fill-${r}-${c}` },
          owner: 'player1',
        };
      }
    }
    const full: StarsState = { ...state, cells };
    expect(getValidPlacements(full)).toEqual([]);
  });
});
