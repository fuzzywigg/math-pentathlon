/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko AI easy/medium/hard leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  hasValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
} from '../../src/games/kwatro-sinko/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 47 kwatro deepen 5 — kwatro — AI difficulties / execute / isAITurn', () => {
  it('getAIMove returns legal chip+node on opening for easy/medium/hard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', diff);
      expect(move).not.toBeNull();
      expect(state.chips.get(move!.chipId)?.owner).toBe('player1');
      expect(getValidMoves(state, move!.chipId)).toContain(move!.nodeId);
    }
  });

  it('getAIMove on mid-state still picks a valid destination for current seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = selectChip(state, 'p1-0');
    state = moveChip(state, getValidMoves(state, 'p1-0')[0]);
    expect(state.currentPlayer).toBe('player2');
    expect(hasValidMoves(state)).toBe(true);

    const move = getAIMove(state, 'player2', 'medium');
    expect(move).not.toBeNull();
    expect(state.chips.get(move!.chipId)?.owner).toBe('player2');
    expect(isValidFor(state, move!.chipId, move!.nodeId)).toBe(true);
  });

  it('executeAITurn advances history and flips to opponent (or keeps on win)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const before = createInitialState();
    const after = executeAITurn(before, 'player1', 'hard');
    expect(after.moveHistory.length).toBe(before.moveHistory.length + 1);
    if (after.phase === 'gameOver') {
      expect(after.winner).toBe('player1');
    } else {
      expect(after.currentPlayer).toBe('player2');
      expect(after.phase).toBe('selectingChip');
    }
  });

  it('isAITurn gates on human-vs-ai, seat, and non-gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player1',
        'human-vs-ai'
      )
    ).toBe(false);
  });

  it('getAIMove null when wrong seat or gameOver', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    expect(
      getAIMove(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player1',
        'hard'
      )
    ).toBeNull();
  });
});

function isValidFor(
  state: ReturnType<typeof createInitialState>,
  chipId: string,
  nodeId: string
): boolean {
  return getValidMoves(state, chipId).includes(nodeId);
}
