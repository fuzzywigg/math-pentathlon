/**
 * Wave 41 — Hex-a-Gone placeBlock without selection identity + selectBlockForPlacement.
 * Phase/shape gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 41 hex-a-gone — place identity / selectForPlacement', () => {
  it('placeBlock identity on selectBlocks and null selection', () => {
    const opening = createInitialState();
    expect(placeBlock(opening, 0, 0)).toBe(opening);

    const forced = {
      ...createInitialState(),
      phase: 'placeBlocks' as const,
      selectedBlockForPlacement: null,
      turnSelection: { blocks: ['triangle' as const], committed: true },
    };
    expect(placeBlock(forced, 0, 0)).toBe(forced);
  });

  it('selectBlockForPlacement identity outside placeBlocks', () => {
    const state = createInitialState();
    expect(selectBlockForPlacement(state, 'triangle')).toBe(state);
    const selected = selectBlock(state, 'triangle');
    expect(selectBlockForPlacement(selected, 'triangle')).toBe(selected);
  });

  it('selectBlockForPlacement rejects shapes not in turn selection', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = selectBlock(state, 'rhombus');
    state = commitSelection(state);
    expect(selectBlockForPlacement(state, 'hexagon')).toBe(state);
    const switched = selectBlockForPlacement(state, 'rhombus');
    expect(switched.selectedBlockForPlacement).toBe('rhombus');
  });

  it('placeBlock on filled cell is identity; empty succeeds', () => {
    let state = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const cell = state.board[0];
    const filled = {
      ...state,
      board: state.board.map((c) =>
        c.q === cell.q && c.r === cell.r
          ? { ...c, filled: true, filledBy: 'player2' as const, blockId: 1 }
          : c
      ),
    };
    expect(placeBlock(filled, cell.q, cell.r)).toBe(filled);

    const next = placeBlock(state, cell.q, cell.r);
    expect(next).not.toBe(state);
    expect(next.phase).toBe('selectBlocks');
    expect(next.currentPlayer).toBe('player2');
    expect(next.bank.triangle).toBe(state.bank.triangle - 1);
  });
});
