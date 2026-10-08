/**
 * Prime Gold — controller.newGame must clear the pending AI timer, and
 * makeAIMove must refuse the human seat so a stale think timeout cannot
 * roll/place for Blue after New Game.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeChip,
  rollDice,
} from '../../src/games/prime-gold/rules';

describe('Prime Gold input-race — newGame clears AI timer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    const { destroyGame } = await import(
      '../../src/games/prime-gold/game-controller'
    );
    destroyGame();
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    vi.restoreAllMocks();
  });

  it('controller.newGame during Red think does not let stale timer roll for Blue', async () => {
    const { newGameVsAI } = await import(
      '../../src/games/prime-gold/game-controller'
    );

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(ctrl.state);
    const placement = getValidPlacements(state)[0]!;
    state = placeChip(state, placement.value, placement.expr);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.moveHistory).toHaveLength(1);

    // Mid-think New Game (public controller API)
    ctrl.newGame(true, 'easy');
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(ctrl.state).toMatchObject(createInitialState());

    await vi.advanceTimersByTimeAsync(800);
    // Stale timer must not have rolled/placed for Blue
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();
    expect(ctrl.state.moveHistory).toHaveLength(0);
  });
});
