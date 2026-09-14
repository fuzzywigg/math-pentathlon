/**
 * Wave 43 — Juggle AI null gates + isAITurn matrix. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement,
  isAITurn,
  executeAITurn,
} from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI null gates', () => {
  it('die/shape/placement return null off-phase or wrong seat', () => {
    const s = createInitialState();
    expect(getAIDieChoice(s, 'player1')).toBeNull();
    expect(getAIShapeChoice(s, 'player1')).toBeNull();
    expect(getAIPlacement(s, 'player1')).toBeNull();

    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 5] as [number, number],
      currentPlayer: 'player1' as const,
    };
    expect(getAIDieChoice(selecting, 'player2')).toBeNull();
    const withCat = { ...selecting, selectedCategory: 'tetromino' as const };
    expect(getAIDieChoice(withCat, 'player1')).toBeNull(); // already selected
    expect(getAIShapeChoice(withCat, 'player2')).toBeNull();
  });

  it('isAITurn requires human-vs-ai and matching seat', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...s, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('executeAITurn from rolling advances and returns a new state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(createInitialState(), 'player1', 'easy');
    expect(next).not.toBe(createInitialState());
    // After a full easy turn from rolling, either still mid-turn or handed off
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(next.phase);
  });

  it('getAIDieChoice returns an index for opening selectingShape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 4] as [number, number],
    };
    const choice = getAIDieChoice(selecting, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });
});
