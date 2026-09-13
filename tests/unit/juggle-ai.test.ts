import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/juggle/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Juggle AI', () => {
  it('isAITurn respects mode, seat, and game over', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIDieChoice returns null before dice are rolled', () => {
    const state = createInitialState();
    expect(getAIDieChoice(state, 'player1', 'easy')).toBeNull();
  });

  it('getAIDieChoice picks 0 or 1 after doRollDice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const rolled = doRollDice(createInitialState());
    expect(rolled.phase).toBe('selectingShape');
    const choice = getAIDieChoice(rolled, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });

  it('getAIShapeChoice returns a shape after a die is selected', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = doRollDice(createInitialState());
    const die = getAIDieChoice(state, 'player1', 'easy');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);
    const shape = getAIShapeChoice(state, 'player1', 'easy');
    expect(shape).not.toBeNull();
    expect(shape!.shape.id).toBeTruthy();
  });

  it('getAIPlacement returns null before placing phase', () => {
    const rolled = doRollDice(createInitialState());
    expect(getAIPlacement(rolled, 'player1', 'easy')).toBeNull();
  });

  it('executeAITurn after doRollDice completes or stays playable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = doRollDice(createInitialState());
    state = executeAITurn(state, 'player1', 'easy');
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(
      state.phase
    );
    if (state.moveHistory.length > 0) {
      expect(state.currentPlayer).toBe('player2');
    }
  });

  it('executeAITurn is a no-op for the wrong player', () => {
    const rolled = doRollDice(createInitialState());
    const next = executeAITurn(rolled, 'player2', 'easy');
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory.length).toBe(rolled.moveHistory.length);
  });
});
