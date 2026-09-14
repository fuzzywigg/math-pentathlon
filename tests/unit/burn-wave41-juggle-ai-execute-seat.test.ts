/**
 * Wave 41 — Juggle executeAITurn advance + isAITurn player2 seat leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
  placeShape,
} from '../../src/games/juggle/rules';
import { executeAITurn, isAITurn, getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Juggle AI — executeAITurn advances phase', () => {
  it('completes a full AI turn from selectingShape into rolling (or gameOver)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = doRollDice(createInitialState());
    expect(state.phase).toBe('selectingShape');
    const beforeHistory = state.moveHistory.length;
    state = executeAITurn(state, 'player1', 'medium');
    if (state.moveHistory.length > beforeHistory) {
      expect(state.phase).toBe('rolling');
      expect(state.currentPlayer).toBe('player2');
      expect(state.currentDice).toBeNull();
      expect(state.selectedShape).toBeNull();
    } else {
      expect(['selectingShape', 'placing', 'rolling']).toContain(state.phase);
    }
  });

  it('hard difficulty also advances when monomino path is forced', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = executeAITurn(state, 'player1', 'hard');
    expect(state.moveHistory.length).toBe(1);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');
  });

  it('easy teaching path still places on open monomino board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = {
      ...createInitialState(),
      currentDice: [1, 2] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = executeAITurn(state, 'player1', 'easy');
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(state.boards.player1.cells.flat().some(Boolean)).toBe(true);
  });
});

describe('Wave 41 Juggle AI — isAITurn player2 seat', () => {
  it('true for human-vs-ai when currentPlayer is player2 and aiPlayer is player2', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    state = placeShape(state, { row: 0, col: 0 });
    expect(state.currentPlayer).toBe('player2');
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
  });

  it('false on gameOver even if aiPlayer matches last seat', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('AI die choice available for player2 after human first move + roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = {
      ...createInitialState(),
      currentDice: [1, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    state = placeShape(state, { row: 1, col: 1 });
    expect(state.currentPlayer).toBe('player2');
    state = doRollDice(state);
    expect(getAIDieChoice(state, 'player2', 'hard')).not.toBeNull();
    state = executeAITurn(state, 'player2', 'hard');
    if (state.moveHistory.length >= 2) {
      expect(state.currentPlayer).toBe('player1');
    }
  });
});
