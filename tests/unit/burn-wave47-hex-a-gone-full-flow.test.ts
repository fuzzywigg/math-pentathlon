/**
 * Wave 47 leftover after #214/#215 — Hex-a-Gone full select→commit→place flow leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
  getValidPlacements,
  canPlayerMove,
  passTurn,
  getPhaseMessage,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 47 hex-a-gone deepen 2 — hex-a-gone — full select→commit→place + mutual pass stuck', () => {
  it('full turn: select → commit → place all → turnComplete for opponent', () => {
    let state = createInitialState();
    expect(canPlayerMove(state)).toBe(true);
    expect(getPhaseMessage(state)).toMatch(/Select 1-3/);

    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toHaveLength(3);

    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.selectedBlockForPlacement).toBe('hexagon');

    // Switch placement order mid-turn
    state = selectBlockForPlacement(state, 'triangle');
    expect(state.selectedBlockForPlacement).toBe('triangle');

    const placements: { q: number; r: number }[] = [];
    while (state.phase === 'placeBlocks' && state.currentPlayer === 'player1') {
      const opts = getValidPlacements(state);
      expect(opts.length).toBeGreaterThan(0);
      const pick = opts[0];
      placements.push(pick);
      state = placeBlock(state, pick.q, pick.r);
    }

    expect(placements).toHaveLength(3);
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player2');
    expect(state.moveHistory).toHaveLength(1);
    expect(state.placedBlocks).toHaveLength(3);
    expect(state.bank.hexagon).toBe(2);
    expect(state.bank.rhombus).toBe(5);
    expect(state.bank.triangle).toBe(11);
  });

  it('getValidPlacements enumerates every empty cell when a block is selected', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    const empty = state.board.filter((c) => !c.filled).length;
    expect(getValidPlacements(state)).toHaveLength(empty);
  });

  it('mutual stuck: both seats passTurn on full board → gameOver', () => {
    const state = createInitialState();
    for (const cell of state.board) cell.filled = true;
    const seeded = {
      ...state,
      moveHistory: [
        {
          player: 'player2' as const,
          blocksPlaced: ['square' as const],
          moveNumber: 1,
        },
      ],
    };
    // First pass — opponent also cannot move → game over immediately
    const ended = passTurn(seeded);
    expect(isGameOver(ended)).toBe(true);
    expect(ended.winner).toBe('player2');
  });

  it('second player full flow after first turnComplete', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    const p = getValidPlacements(state)[0];
    state = placeBlock(state, p.q, p.r);
    expect(state.currentPlayer).toBe('player2');

    state = selectBlock(state, 'trapezoid');
    state = commitSelection(state);
    expect(getPhaseMessage(state)).toContain('Red');
    const p2 = getValidPlacements(state)[0];
    state = placeBlock(state, p2.q, p2.r);
    expect(state.currentPlayer).toBe('player1');
    expect(state.moveHistory).toHaveLength(2);
  });
});
