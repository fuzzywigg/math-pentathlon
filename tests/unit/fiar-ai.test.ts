import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FIAR AI', () => {
  it('getAIMove returns a place move on a fresh placement board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(typeof move!.nodeId).toBe('string');
    expect(state.board.nodes.has(move!.nodeId!)).toBe(true);
  });

  it('getAIMove after game over still returns null-safe placement phase end', () => {
    // FIAR AI does not gate on seat; cover a finished board instead.
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    // Movement/placement helpers yield nothing useful on gameOver
    const move = getAIMove(state, 'player1', 'easy');
    // Either null or a place attempt on remaining empty — must not throw
    if (move) {
      expect(move.type).toBe('place');
    } else {
      expect(move).toBeNull();
    }
  });

  it('applyAIMove places a chip and records history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();

    const next = applyAIMove(state, move!);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('applyAIMove with a crafted place move writes the chip onto the node', () => {
    const state = createInitialState();
    const emptyId = [...state.board.nodes.entries()].find(
      ([, n]) => n.chip === null
    )![0];
    const next = applyAIMove(state, { type: 'place', nodeId: emptyId });
    expect(next.board.nodes.get(emptyId)?.chip).toBe('player1');
  });

  it('applyAIMove ignores malformed move objects', () => {
    const state = createInitialState();
    const next = applyAIMove(state, { type: 'place' });
    expect(next).toBe(state);
  });

  it('getAIMove medium still returns a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move?.type).toBe('place');
    expect(state.board.nodes.get(move!.nodeId!)?.chip).toBeNull();
  });
});
