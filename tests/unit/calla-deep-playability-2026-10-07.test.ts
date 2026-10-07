/**
 * Deep playtest regressions (2026-10-07) — Calla playability polish.
 * No rules/scoring changes: UX labels, teaching hints, reset difficulty,
 * human soft-lock settle, larger pit hit targets.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as callaAi from '../../src/games/calla/ai';
import {
  initGame,
  newGameVsAI,
  resetGame,
  getGameState,
  getCurrentHint,
} from '../../src/games/calla/game-controller';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard, renderStatus } from '../../src/games/calla/board-ui';
import {
  getPhaseMessage,
  getLastMoveInfo,
  makeMove,
  settleNoValidMoves,
  getValidPits,
} from '../../src/games/calla/rules';
import { getAIMove } from '../../src/games/calla/ai';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Calla deep playability — winner / seat copy', () => {
  it('uses You Win! (not You Wins!) in human-vs-AI', () => {
    const el = document.createElement('div');
    renderStatus(
      { ...createInitialState(), phase: 'gameOver', winner: 'player1' },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔵 You Win! 🎉'
    );
  });

  it('keeps Blue Wins! / AI Wins! grammar', () => {
    const hvh = document.createElement('div');
    renderStatus(
      { ...createInitialState(), phase: 'gameOver', winner: 'player1' },
      hvh,
      'human-vs-human'
    );
    expect(hvh.querySelector('.status-winner')?.textContent).toMatch(
      /Blue Wins!/
    );

    const ai = document.createElement('div');
    renderStatus(
      { ...createInitialState(), phase: 'gameOver', winner: 'player2' },
      ai,
      'human-vs-ai'
    );
    expect(ai.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
  });

  it('phase + last-move copy use Your/AI in vs-AI mode', () => {
    expect(getPhaseMessage(createInitialState(), 'human-vs-ai')).toBe(
      'Your turn - Select a shield to distribute'
    );
    expect(
      getPhaseMessage(
        { ...createInitialState(), currentPlayer: 'player2' },
        'human-vs-ai'
      )
    ).toMatch(/^AI's turn/);

    const after = makeMove(createInitialState(), 2);
    expect(getLastMoveInfo(after, 'human-vs-ai')).toMatch(/^You distributed/);
    // HvH default unchanged for existing burn tests
    expect(getLastMoveInfo(after)).toMatch(/^Blue distributed/);
  });
});

describe('Calla deep playability — teaching hint surface', () => {
  it('renders Easy teaching hint when provided on human turn', () => {
    const el = document.createElement('div');
    renderStatus(
      createInitialState(),
      el,
      'human-vs-ai',
      false,
      'Look carefully! There is a capture.'
    );
    const hint = el.querySelector('[data-testid="calla-teaching-hint"]');
    expect(hint?.textContent).toMatch(/capture/i);
  });

  it('hides teaching hint while AI is thinking or game over', () => {
    const thinking = document.createElement('div');
    renderStatus(createInitialState(), thinking, 'human-vs-ai', true, 'hint');
    expect(
      thinking.querySelector('[data-testid="calla-teaching-hint"]')
    ).toBeNull();

    const over = document.createElement('div');
    renderStatus(
      { ...createInitialState(), phase: 'gameOver', winner: 'player1' },
      over,
      'human-vs-ai',
      false,
      'hint'
    );
    expect(over.querySelector('[data-testid="calla-teaching-hint"]')).toBeNull();
  });
});

describe('Calla deep playability — controller polish', () => {
  it('resetGame preserves Hard AI difficulty', () => {
    vi.useFakeTimers();
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('hard');

    resetGame();
    expect(getGameState().phase).toBe('selectPit');
    expect(getGameState().moveHistory).toHaveLength(0);

    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(status.textContent).toMatch(/thinking/i);
    vi.advanceTimersByTime(600);
    // AI completed a move (Hard path still armed after reset)
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('settleNoValidMoves ends via existing collection when human has no pits', () => {
    const stuck = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [2, 0, 1, 0, 0],
      player1Calla: 5,
      player2Calla: 3,
      currentPlayer: 'player1' as const,
      phase: 'selectPit' as const,
    };
    expect(getValidPits(stuck)).toEqual([]);
    const ended = settleNoValidMoves(stuck);
    expect(ended.phase).toBe('gameOver');
    expect(ended.player2Calla).toBe(3 + 2 + 1);

    const board = document.createElement('div');
    renderBoard(createInitialState(), board, undefined, 'human-vs-ai');
    expect(board.querySelectorAll('.calla-pit-valid').length).toBe(0);
  });

  it('surfaces Easy teaching hint from AI and clears after human sow', () => {
    vi.useFakeTimers();
    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({
      pit: 0,
      hint: 'Can you find a move that gives you a free turn?',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    expect(getCurrentHint()).toBeNull();

    // Pit 0 does not land in Calla — hands off to AI
    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().currentPlayer).toBe('player2');

    vi.advanceTimersByTime(600);
    expect(callaAi.getAIMove).toHaveBeenCalled();
    expect(getCurrentHint()).toBe(
      'Can you find a move that gives you a free turn?'
    );
    expect(
      status.querySelector('[data-testid="calla-teaching-hint"]')?.textContent
    ).toMatch(/free turn/i);

    const valid = board.querySelector('.calla-pit-valid');
    valid?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentHint()).toBeNull();
  });
});

describe('Calla deep playability — AI free-turn thinking chrome', () => {
  it('keeps thinking status through an AI free-turn chain gap', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(callaAi, 'getAIMove');
    // Pit 2 from opening lands in Calla → free turn for Red
    spy.mockReturnValueOnce({ pit: 2 }).mockReturnValueOnce({ pit: 0 });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');

    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    vi.advanceTimersByTime(600);
    expect(getGameState().moveHistory[1]?.gotFreeTurn).toBe(true);
    expect(getGameState().currentPlayer).toBe('player2');
    // Gap before free-turn timer: must still show thinking (not "AI's turn")
    expect(status.textContent).toMatch(/thinking/i);
    expect(status.textContent).not.toMatch(/AI's turn/i);
    expect(board.querySelectorAll('.calla-pit-valid').length).toBe(0);

    // Free-turn delay re-enters triggerAITurn, which then waits AI_THINKING_DELAY
    vi.advanceTimersByTime(250);
    expect(status.textContent).toMatch(/thinking/i);
    vi.advanceTimersByTime(600);
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Calla deep playability — touch hit target', () => {
  it('pit hit circle radius is at least 40 (SVG units)', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el, () => undefined);
    const hit = el.querySelector('.calla-pit-hit');
    expect(Number(hit?.getAttribute('r'))).toBeGreaterThanOrEqual(40);
  });
});

describe('Calla deep playability — AI still legal on all difficulties', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    '%s returns a legal pit from opening',
    (difficulty) => {
      const state = {
        ...createInitialState(),
        currentPlayer: 'player2' as const,
      };
      const move = getAIMove(state, 'player2', difficulty);
      expect(move).not.toBeNull();
      expect(getValidPits(state)).toContain(move!.pit);
    }
  );
});
