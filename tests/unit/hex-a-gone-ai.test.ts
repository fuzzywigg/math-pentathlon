import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/hex-a-gone/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Hex-A-Gone AI', () => {
  it('isAITurn respects mode, seat, and game over', () => {
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

  it('getAISelection returns null outside selectBlocks / wrong seat', () => {
    const state = createInitialState();
    expect(getAISelection(state, 'player2', 'easy')).toBeNull();
    expect(
      getAISelection({ ...state, phase: 'placeBlocks' }, 'player1', 'easy')
    ).toBeNull();
  });

  it('getAISelection easy returns unique bank shapes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const selection = getAISelection(state, 'player1', 'easy');
    expect(selection).not.toBeNull();
    expect(selection!.blocks.length).toBeGreaterThan(0);
    expect(new Set(selection!.blocks).size).toBe(selection!.blocks.length);
    for (const shape of selection!.blocks) {
      expect(state.bank[shape]).toBeGreaterThan(0);
    }
  });

  it('getAIPlacement returns null before placement phase', () => {
    const state = createInitialState();
    expect(getAIPlacement(state, 'player1', 'easy')).toBeNull();
  });

  it('getAIPlacement returns coords after a committed selection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    const selection = getAISelection(state, 'player1', 'easy');
    expect(selection).not.toBeNull();
    for (const block of selection!.blocks) {
      state = selectBlock(state, block);
    }
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');

    const placement = getAIPlacement(state, 'player1', 'easy');
    expect(placement).not.toBeNull();
    expect(typeof placement!.q).toBe('number');
    expect(typeof placement!.r).toBe('number');
  });

  it('executeAITurn advances from selectBlocks without stalling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(['selectBlocks', 'placeBlocks', 'gameOver']).toContain(next.phase);
    expect(
      next.currentPlayer === 'player2' ||
        next.phase === 'placeBlocks' ||
        next.phase === 'gameOver'
    ).toBe(true);
  });
});
