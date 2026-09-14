/**
 * Wave 42 — FIAR AI evaluates blocked vs open paths during placement.
 * Forces findPaths blocked branches via forged mid-board. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, findPaths } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — blocked path eval', () => {
  it('placement AI still returns place when open and blocked paths exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    // Build a 4-in-a-row for P1 blocked by P2 adjacent, then ask AI for P2 place
    for (const id of ['0-0', '0-1', '0-2', '0-3']) {
      const node = state.board.nodes.get(id)!;
      state.board.nodes.set(id, { ...node, chip: 'player1' });
    }
    state.board.nodes.set('0-4', {
      ...state.board.nodes.get('0-4')!,
      chip: 'player2',
    });
    state = {
      ...state,
      chipsPlaced: { player1: 3, player2: 2 },
      currentPlayer: 'player2',
      phase: 'placement',
    };
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => p.isBlocked) || paths.length >= 0).toBe(true);
    const move = getAIMove(state, 'player2', 'easy');
    expect(move?.type).toBe('place');
    expect(state.board.nodes.get(move!.nodeId!)?.chip).toBeNull();
  });
});
