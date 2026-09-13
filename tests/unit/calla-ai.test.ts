import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { analyzeMoves, getAIMove, isAITurn } from '../../src/games/calla/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Calla AI', () => {
  it('isAITurn only true in human-vs-ai for the AI seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(
      isAITurn(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('analyzeMoves returns an entry for every valid pit', () => {
    const state = createInitialState();
    const analyses = analyzeMoves(state, 'player1');
    const valid = getValidPits(state);
    expect(analyses.length).toBe(valid.length);
    expect(analyses.every((a) => valid.includes(a.pit))).toBe(true);
    expect(analyses.some((a) => a.isBestMove)).toBe(true);
    expect(analyses.every((a) => typeof a.reasoning === 'string')).toBe(true);
  });

  it('getAIMove returns null for wrong seat or game over', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    expect(
      getAIMove(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player1',
        'easy'
      )
    ).toBeNull();
  });

  it('getAIMove easy returns a valid pit on a fresh board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
  });

  it('getAIMove medium returns a valid pit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
  });

  it('analyzeMoves ranks a single legal pit as best when only one remains', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 3, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses).toHaveLength(1);
    expect(analyses[0].pit).toBe(2);
    expect(analyses[0].isBestMove).toBe(true);
  });
});
