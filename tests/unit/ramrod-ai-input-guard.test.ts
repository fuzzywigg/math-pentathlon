/**
 * Human rod/box input must not succeed during the computer think pause.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeRod,
  selectRod,
} from '../../src/games/ramrod/rules';
import { renderBoard, renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Ramrod AI-turn input guard', () => {
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

  it('renderBoard with allowInput false does not mark valid slots', () => {
    let state = createInitialState();
    const rodId = state.playerRods.player1[0]!;
    state = selectRod(state, rodId);
    expect(state.selectedRod).toBe(rodId);
    expect(getValidPlacements(state, rodId).length).toBeGreaterThan(0);

    const el = renderBoard(state, () => undefined, { allowInput: false });
    expect(el.querySelectorAll('.ramrod-slot.valid')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
  });

  it('renderPlayerRods with allowInput false does not mark rods selectable', () => {
    const state = createInitialState();
    const el = renderPlayerRods(state, 'player1', () => undefined, {
      allowInput: false,
    });
    expect(el.querySelectorAll('.ramrod-rod-wrapper.selectable')).toHaveLength(
      0
    );
  });

  it('blocks selecting a Red rod during the 800ms AI pause', async () => {
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
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(root.querySelectorAll('.ramrod-slot.valid')).toHaveLength(0);
    expect(root.querySelector('.ramrod-rod-wrapper.selectable')).toBeNull();

    const redHand = root.querySelector('.ramrod-player-player2');
    const redRod = redHand?.querySelector('.ramrod-rod-wrapper');
    redRod?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedRod).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(ctrl.state.moveHistory[1]?.player).toBe('player2');
  });
});
