/**
 * Wave 55 leftover after #249/#250 — Fab vsAI 800ms executeAITurn. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { newGameVsAI } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — vsAI timer', () => {
  it('schedules AI turn after 800ms when seat is player2', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsAI(container, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');

    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const beforeHistory = ctrl.state.moveHistory.length;
    const beforeSeat = ctrl.state.currentPlayer;
    ctrl.update();

    vi.advanceTimersByTime(800);
    // AI either claims (history grows / seat flips) or passes (seat flips)
    expect(
      ctrl.state.moveHistory.length > beforeHistory ||
        ctrl.state.currentPlayer !== beforeSeat ||
        ctrl.state.winner !== null
    ).toBe(true);
  });
});
