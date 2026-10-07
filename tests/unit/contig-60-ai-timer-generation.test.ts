/**
 * Contig 60 — stale AI setTimeouts must not roll/place after New Game.
 * Deep playtest 2026-10-07: New Game during the AI pause left Blue with
 * auto-rolled dice (handleRollDice(true) lacked a seat + generation guard).
 */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
} from '../../src/games/contig-60/game-controller';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Contig 60 AI timer generation', () => {
  it('New Game during AI roll delay leaves a fresh rolling human seat (no auto-dice)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');

    // Human rolls and places → schedules AI roll after AI_ROLL_DELAY_MS
    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const valid = board.querySelector('.contig-cell-valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.click();

    expect(status.textContent).toMatch(/Computer is thinking/);

    // Restart before the AI timer fires
    newGameVsAI('medium');
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(board.querySelectorAll('.contig-die').length).toBe(0);
    expect(status.textContent).toMatch(/Blue's turn/);
    expect(status.textContent).toMatch(/Roll the dice/);

    // Flush pending timers — must not roll for Blue
    vi.advanceTimersByTime(5000);
    expect(board.querySelectorAll('.contig-die').length).toBe(0);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(board.querySelectorAll('.contig-cell-p1').length).toBe(0);
    expect(board.querySelectorAll('.contig-cell-p2').length).toBe(0);
  });

  it('switching to vs-human cancels a pending AI place after roll', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      currentPlayer: 'player2',
      phase: 'rolling',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('hard');

    // Manually kick the AI roll path by placing as human first on a real game
    vi.mocked(types.createInitialState).mockRestore();
    newGameVsAI('hard');
    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    board.querySelector('.contig-cell-valid')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );

    newGameVsHuman();
    vi.advanceTimersByTime(5000);

    expect(status.textContent).toMatch(/Blue's turn/);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(board.querySelectorAll('.contig-die').length).toBe(0);
  });
});
