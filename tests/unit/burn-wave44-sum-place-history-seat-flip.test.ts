/**
 * Wave 44 — Sum Dominoes placeDomino history and currentPlayer flip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  placeDomino,
  getValidPlacements,
  formatMove,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function seedState(player: 'player1' | 'player2' = 'player1'): SumDominoesState {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
    orientation: 'horizontal',
  };
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;
  const tile = makeDomino('play', 0, 2, player);
  return {
    board,
    hands: {
      player1: player === 'player1' ? [tile, makeDomino('extra', 1, 1)] : [makeDomino('p1', 3, 3)],
      player2: player === 'player2' ? [tile, makeDomino('extra2', 1, 1, 'player2')] : [makeDomino('p2', 4, 4, 'player2')],
    },
    currentPlayer: player,
    currentDice: [3, 3], // sum 6
    selectedDomino: 'play',
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 2, // should reset on place
  };
}

describe('Wave 44 sum-dominoes — placeDomino history / seat flip', () => {
  it('appends history entry with moveNumber and formatable equation', () => {
    const state = seedState('player1');
    const tile = state.hands.player1.find((d) => d.id === 'play')!;
    const pick = getValidPlacements(state, tile, 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.moveHistory).toHaveLength(1);
    const mv = next.moveHistory[0];
    expect(mv.moveNumber).toBe(1);
    expect(mv.player).toBe('player1');
    expect(mv.diceSum).toBe(6);
    expect(mv.domino.id).toBe('play');
    expect(formatMove(mv)).toMatch(/^\[0\|2\] \(\d\+\d=6\)$/);
  });

  it('flips currentPlayer to opponent and clears dice/selection', () => {
    const state = seedState('player1');
    const tile = state.hands.player1.find((d) => d.id === 'play')!;
    const pick = getValidPlacements(state, tile, 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.winner).toBeNull();
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
    expect(next.selectedDomino).toBeNull();
    expect(next.passCount).toBe(0);
  });

  it('player2 place flips back to player1', () => {
    const state = seedState('player2');
    const tile = state.hands.player2.find((d) => d.id === 'play')!;
    const pick = getValidPlacements(state, tile, 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory[0].player).toBe('player2');
  });

  it('emptying hand wins without flipping seat', () => {
    const state = seedState('player1');
    state.hands.player1 = [makeDomino('play', 0, 2)];
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
    expect(next.currentPlayer).toBe('player1');
    expect(next.hands.player1).toHaveLength(0);
  });
});
