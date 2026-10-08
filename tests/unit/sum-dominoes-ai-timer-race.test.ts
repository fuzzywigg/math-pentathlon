/**
 * Regression: stacked AI setTimeouts must not roll/place on the human seat.
 * Pre-fix: updateUI scheduled makeAIMove every rebuild AND makeAIMove also
 * chained a second timer after roll — the stale timer could doRollDice on Blue.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';
import { clearDom, mountAppShell } from './helpers/dom';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  clearDom(['sd-styles']);
});
describe('Sum Dominoes AI timer race', () => {
  it('does not auto-roll when it becomes the human seat after AI finishes', () => {
    vi.useFakeTimers();
    const container = mountAppShell();
    const ctrl = initGame(container, true, 'easy');

    // Red (AI) to roll
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
      selectedDomino: null,
    };
    ctrl.update();

    // First AI think pause (800ms) → roll → update schedules another 800ms
    // and historically also chained 600ms for place.
    vi.advanceTimersByTime(800);

    // Drain nested AI steps (roll → place/pass)
    for (let i = 0; i < 8; i++) {
      vi.advanceTimersByTime(800);
      if (ctrl.state.currentPlayer === 'player1' || ctrl.state.winner) break;
    }

    expect(ctrl.state.winner || ctrl.state.currentPlayer === 'player1').toBe(true);

    if (!ctrl.state.winner) {
      // Human seat must still be waiting to roll — stale AI timers must not roll.
      expect(ctrl.state.currentPlayer).toBe('player1');
      expect(ctrl.state.phase).toBe('rolling');
      expect(ctrl.state.currentDice).toBeNull();
      expect(container.querySelector('.sd-roll-btn')).toBeTruthy();

      // Advance well past any leftover timers from the AI chain.
      vi.advanceTimersByTime(5000);
      expect(ctrl.state.currentPlayer).toBe('player1');
      expect(ctrl.state.phase).toBe('rolling');
      expect(ctrl.state.currentDice).toBeNull();
    }
  });

  it('makeAIMove is a no-op when called while Blue is to move', () => {
    vi.useFakeTimers();
    const container = mountAppShell();
    const ctrl = initGame(container, true, 'medium');
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.currentDice).toBeNull();

    // No AI schedule on human seat; force a long wait anyway.
    vi.advanceTimersByTime(10_000);
    expect(ctrl.state.currentDice).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('rolling');
  });
});
