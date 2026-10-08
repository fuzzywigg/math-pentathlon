/**
 * Human card/cell input must not succeed during the computer think pause.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeCard,
  selectCard,
} from '../../src/games/stars-bars/rules';
import { renderBoard, renderPlayerHand } from '../../src/games/stars-bars/board-ui';
import { installDomHooks } from './helpers/dom';

describe('Stars & Bars AI-turn input guard', () => {
  installDomHooks({ fakeTimers: true, styleIds: ['stars-styles'] });
  it('renderBoard with allowInput false does not mark valid placements', () => {
    let state = createInitialState();
    const cardId = state.playerHands.player1[0]!.id;
    state = selectCard(state, cardId);
    expect(state.phase).toBe('placingCard');
    expect(getValidPlacements(state).length).toBeGreaterThan(0);

    const el = renderBoard(state, () => undefined, { allowInput: false });
    expect(el.querySelectorAll('.stars-cell.valid')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
  });

  it('renderPlayerHand with allowInput false disables current-player cards', () => {
    const state = createInitialState();
    const el = renderPlayerHand(state, 'player1', () => undefined, {
      allowInput: false,
    });
    expect(el.querySelectorAll('.stars-card.disabled').length).toBe(
      state.playerHands.player1.length
    );
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
  });

  it('blocks selecting a Computer card during the AI think pause', async () => {
    const { newGameVsAI } =
      await import('../../src/games/stars-bars/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    const blueCard = ctrl.state.playerHands.player1[0]!;
    let state = selectCard(ctrl.state, blueCard.id);
    const placement = getValidPlacements(state)[0]!;
    state = placeCard(state, placement.row, placement.col);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(root.querySelectorAll('.stars-cell.valid')).toHaveLength(0);
    expect(
      root.querySelector('.stars-hand-container .stars-card:not(.disabled)')
    ).toBeNull();

    const redHand = root.querySelectorAll(
      '.stars-hand-container'
    )[1] as HTMLElement;
    const redCard = redHand?.querySelector('.stars-card');
    redCard?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedCard).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(ctrl.state.moveHistory[1]?.player).toBe('player2');
  });
});
