/**
 * Wave 41 — Sum Dominoes placeDomino phase / invalid identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  placeDomino,
  getValidPlacements,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 41 sum-dominoes — placeDomino identity', () => {
  it('identity when not placing / no selection / no dice', () => {
    const base = createInitialState();
    expect(placeDomino(base, { row: 5, col: 4 }, 'horizontal')).toBe(base);

    const noSel: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [3, 3],
      selectedDomino: null,
    };
    expect(placeDomino(noSel, { row: 5, col: 4 }, 'horizontal')).toBe(noSel);

    const noDice: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: null,
      selectedDomino: 'd0',
    };
    expect(placeDomino(noDice, { row: 5, col: 4 }, 'horizontal')).toBe(noDice);
  });

  it('identity when selected id missing from hand', () => {
    const base = createInitialState();
    const state: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [1, 5],
      selectedDomino: 'not-in-hand',
    };
    expect(placeDomino(state, { row: 4, col: 5 }, 'vertical')).toBe(state);
  });

  it('identity on invalid placement; success places first adjacent match', () => {
    const base = createInitialState();
    const tile = makeDomino('ok', 0, 0);
    const state: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [3, 3], // sum 6 → 0+6
      selectedDomino: 'ok',
      hands: { ...base.hands, player1: [tile, ...base.hands.player1] },
    };
    expect(
      placeDomino(state, { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL }, 'horizontal')
    ).toBe(state);

    const valids = getValidPlacements(state, tile, 6);
    expect(valids.length).toBeGreaterThan(0);
    const pick = valids[0];
    expect(
      isValidPlacement(state, tile, pick.position, pick.orientation, 6)
    ).toBe(true);
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next).not.toBe(state);
    expect(next.selectedDomino).toBeNull();
    expect(next.hands.player1.find((d) => d.id === 'ok')).toBeUndefined();
    expect(next.moveHistory).toHaveLength(1);
  });
});
