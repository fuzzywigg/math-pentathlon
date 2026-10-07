/**
 * Stale AI timers must not pass or place on Blue's seat.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeRod,
  selectRod,
} from '../../src/games/ramrod/rules';

describe('Ramrod AI timer race', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('stacked updateUI schedules do not illicitly pass Blue after AI finishes', async () => {
    const { newGameVsAI } =
      await import('../../src/games/ramrod/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    const blueRod = ctrl.state.playerRods.player1[0]!;
    let state = selectRod(ctrl.state, blueRod);
    const placement = getValidPlacements(state, blueRod)[0]!;
    state = placeRod(state, placement.boxId, placement.slot);
    ctrl.state = state;

    // Simulate multiple rebuilds while Red is to move (would stack timers before fix)
    ctrl.update();
    ctrl.update();
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    const historyAfterBlue = ctrl.state.moveHistory.length;

    await vi.advanceTimersByTimeAsync(550);
    // AI should have moved exactly once
    expect(ctrl.state.moveHistory.length).toBe(historyAfterBlue + 1);
    expect(ctrl.state.moveHistory.at(-1)?.player).toBe('player2');
    expect(ctrl.state.currentPlayer).toBe('player1');

    const blueHistory = ctrl.state.moveHistory.length;
    // Extra time must not fire another stale AI pass on Blue
    await vi.advanceTimersByTimeAsync(2000);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBe(blueHistory);
    expect(ctrl.state.phase).toBe('selectingRod');
  });

  it('newGame clears pending AI timer so prior game cannot steal the seat', async () => {
    const { newGameVsAI } =
      await import('../../src/games/ramrod/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'medium');

    const blueRod = ctrl.state.playerRods.player1[0]!;
    let state = selectRod(ctrl.state, blueRod);
    const placement = getValidPlacements(state, blueRod)[0]!;
    ctrl.state = placeRod(state, placement.boxId, placement.slot);
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');

    ctrl.newGame(true, 'easy');
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(2000);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(createInitialState().phase).toBe('selectingRod');
  });
});
