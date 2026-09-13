import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove,
  isAITurn,
  executeAITurn,
  applyAIMoveSteps,
} from '../../src/games/fab-a-diffy/ai';
import {
  renderOperationSelector,
  renderScores,
  renderMoveHistory,
} from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Fab-a-Diffy AI', () => {
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
      isAITurn(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player1',
        'human-vs-ai'
      )
    ).toBe(false);
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

  it('getAIMove easy returns bars/op/answer present on the board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
    expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
    expect(state.answerBars.has(move!.answerId)).toBe(true);
    expect(['add', 'subtract', 'multiply', 'divide']).toContain(move!.operation);
  });

  it('getAIMove medium returns a concrete move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.bar1Id).not.toBe(move!.bar2Id);
  });

  it('executeAITurn easy flips seat and records history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory.length).toBe(1);
  });

  it('executeAITurn passes when no move is available for wrong seat', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory.length).toBe(0);
  });

  it('applyAIMoveSteps rejects bad bar2 without stalling mid-confirm', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const bars = Array.from(state.fractionBars.keys());
    const next = applyAIMoveSteps(state, {
      bar1Id: bars[0],
      bar2Id: 'missing-bar-2',
      operation: 'add',
      answerId: Array.from(state.answerBars.keys())[0],
    });
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory.length).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe('Fab-a-Diffy secondary UI', () => {
  it('renderOperationSelector shows ops after two bars are selected', () => {
    let state = createInitialState();
    const bars = Array.from(state.fractionBars.keys());
    state = selectBar1(state, bars[0]);
    state = selectBar2(state, bars[1]);
    expect(state.phase).toBe('selectingOperation');

    const el = renderOperationSelector(state, () => undefined);
    document.body.appendChild(el);
    expect(el.classList.contains('fab-operation-selector')).toBe(true);
    expect(el.querySelector('.fab-operation-preview')).toBeTruthy();
    expect(el.querySelectorAll('.fab-op-btn, .fab-op-valid').length).toBeGreaterThan(0);
  });

  it('renderScores and renderMoveHistory mount with expected classes', () => {
    const state = createInitialState();
    const scores = renderScores(state);
    const history = renderMoveHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('fab-scores')).toBe(true);
    expect(history.classList.contains('fab-history')).toBe(true);
  });
});
