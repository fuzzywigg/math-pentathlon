/**
 * Wave 40 — Hex-a-Gone selectBlock / deselect / commit reject matrix.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
  getPhaseMessage,
  passTurn,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 40 hex-a-gone — selectBlock reject matrix', () => {
  it('rejects wrong phase, duplicate, empty bank, length≥3', () => {
    const state = createInitialState();
    const placePhase = { ...state, phase: 'placeBlocks' as const };
    expect(selectBlock(placePhase, 'hexagon')).toBe(placePhase);

    const one = selectBlock(state, 'hexagon');
    expect(selectBlock(one, 'hexagon')).toBe(one); // duplicate

    const emptyBank = {
      ...state,
      bank: { ...state.bank, triangle: 0 },
    };
    expect(selectBlock(emptyBank, 'triangle')).toBe(emptyBank);

    let full = state;
    for (const shape of ['hexagon', 'trapezoid', 'rhombus'] as const) {
      full = selectBlock(full, shape);
    }
    expect(full.turnSelection.blocks).toHaveLength(3);
    expect(selectBlock(full, 'square')).toBe(full);
  });

  it('deselect miss is identity; commit empty is identity', () => {
    const state = createInitialState();
    expect(deselectBlock(state, 'hexagon')).toBe(state);
    expect(commitSelection(state)).toBe(state);

    const one = selectBlock(state, 'square');
    const gone = deselectBlock(one, 'square');
    expect(gone.turnSelection.blocks).toHaveLength(0);
  });

  it('commit → place; selectBlockForPlacement / placeBlock rejects', () => {
    const state = createInitialState();
    const one = selectBlock(state, 'triangle');
    const committed = commitSelection(one);
    expect(committed.phase).toBe('placeBlocks');
    expect(getPhaseMessage(committed)).toMatch(/Place|remaining/i);

    expect(selectBlockForPlacement(committed, 'hexagon')).toBe(committed);
    // Wrong phase place
    expect(placeBlock(state, 0, 0)).toBe(state);
  });

  it('passTurn identity on gameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(passTurn(over)).toBe(over);
  });
});
