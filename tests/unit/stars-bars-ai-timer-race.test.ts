/**
 * Regression: stacked AI setTimeouts / New Game must not place on the human seat.
 * Pre-fix: every updateUI scheduled makeAIMove(800) without clearing prior timers.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeCard,
  selectCard,
} from '../../src/games/stars-bars/rules';
import { initGame } from '../../src/games/stars-bars/game-controller';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

function mount(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const container = document.createElement('div');
  app.appendChild(container);
  return container;
}

describe('Stars & Bars AI timer race', () => {
  it('does not place a second AI move after New Game mid-think', () => {
    vi.useFakeTimers();
    const container = mount();
    const ctrl = initGame(container, true, 'easy');

    // Human places once → AI seat
    const blueCard = ctrl.state.playerHands.player1[0]!;
    let state = selectCard(ctrl.state, blueCard.id);
    const placement = getValidPlacements(state)[0]!;
    state = placeCard(state, placement.row, placement.col);
    ctrl.state = state;
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Mid AI think pause — New Game resets to human seat
    vi.advanceTimersByTime(200);
    ctrl.newGame(true, 'easy');
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);

    // Stale timer must not fire a Computer placement on the fresh board
    vi.advanceTimersByTime(5000);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(ctrl.state.phase).toBe('selectingCard');
  });

  it('makeAIMove is a no-op when it is the human seat', () => {
    vi.useFakeTimers();
    const container = mount();
    const ctrl = initGame(container, true, 'medium');
    expect(ctrl.state.currentPlayer).toBe('player1');

    vi.advanceTimersByTime(10_000);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(createInitialState().phase).toBe('selectingCard');
  });

  it('re-init clears prior AI timer (shell New Game path)', () => {
    vi.useFakeTimers();
    const container = mount();
    const first = initGame(container, true, 'hard');

    const blueCard = first.state.playerHands.player1[0]!;
    let state = selectCard(first.state, blueCard.id);
    const placement = getValidPlacements(state)[0]!;
    state = placeCard(state, placement.row, placement.col);
    first.state = state;
    first.update();
    expect(first.state.currentPlayer).toBe('player2');

    // Shell calls newGameVsAI → initGame again on same container
    const second = initGame(container, true, 'easy');
    expect(second.state.currentPlayer).toBe('player1');
    expect(second.state.moveHistory).toHaveLength(0);

    vi.advanceTimersByTime(5000);
    expect(second.state.currentPlayer).toBe('player1');
    expect(second.state.moveHistory).toHaveLength(0);
    // Orphan first controller must not rewrite the DOM for a Computer move
    const status = container.querySelector('.stars-status')?.textContent ?? '';
    expect(status).toMatch(/Your turn|Select a card/i);
    expect(status).not.toMatch(/thinking/i);
  });
});
