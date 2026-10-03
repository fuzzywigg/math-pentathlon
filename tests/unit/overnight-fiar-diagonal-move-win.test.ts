/**
 * Overnight HEAVY — FIAR moveChip along diagonal is legal.
 * Under official rules diagonals can win with gaps; this case stays short of 4.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { moveChip, canMove, checkWinner } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function movementBoard(
  placements: Array<{
    id: string;
    chip: 'player1' | 'player2';
    kind?: 'plain' | 'marked';
  }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, {
      ...nodes.get(p.id)!,
      chip: p.chip,
      chipKind: p.kind ?? 'plain',
    });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    chipInventory: {
      player1: { plain: 0, marked: 0 },
      player2: { plain: 0, marked: 0 },
    },
    currentPlayer: 'player1',
  };
}

describe('Overnight fiar — diagonal move legality', () => {
  it('can slide diagonally onto empty node without creating a 4-path', () => {
    // Only two P1 chips on the diagonal — slide 4-4 → 3-3 keeps length 2
    const state = movementBoard([
      { id: '4-4', chip: 'player1' },
      { id: '0-0', chip: 'player1' },
      { id: '0-4', chip: 'player2' },
      { id: '1-3', chip: 'player2' },
      { id: '2-1', chip: 'player2' },
      { id: '4-0', chip: 'player2' },
    ]);
    expect(checkWinner(state)).toBeNull();
    expect(canMove(state, '4-4', '3-3')).toBe(true);
    const next = moveChip(state, '4-4', '3-3');
    expect(next.board.nodes.get('3-3')!.chip).toBe('player1');
    expect(next.board.nodes.get('4-4')!.chip).toBeNull();
    expect(checkWinner(next)).toBeNull();
    expect(next.phase).toBe('movement');
    expect(next.currentPlayer).toBe('player2');
  });
});
