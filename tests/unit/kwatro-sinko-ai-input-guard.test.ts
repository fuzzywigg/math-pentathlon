/**
 * #378 — Human chip/node clicks must not succeed during the computer think pause.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getValidMoves,
  moveChip,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';
import { installDomHooks } from './helpers/dom';

describe('Kwatro-Sinko AI-turn input guard (#378)', () => {
  installDomHooks({ fakeTimers: true, styleIds: ['kwa-styles'] });
  afterEach(async () => {
    vi.useRealTimers();
    const { destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    destroyGame();
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('renderBoard with allowInput false does not mark chips selectable', () => {
    const el = renderBoard(
      createInitialState(),
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    expect(el.querySelectorAll('.kwa-selectable-chip')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="selectable"]')).toBeNull();
  });

  it('blocks selecting and moving a Red chip during the 800ms AI pause', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    let state = selectChip(ctrl.state, 'p1-0');
    const dest = getValidMoves(state, 'p1-0').find((id) => id === 'n1-0') ??
      getValidMoves(state, 'p1-0')[0];
    expect(dest).toBeTruthy();
    state = moveChip(state, dest!);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(root.querySelectorAll('.kwa-selectable-chip')).toHaveLength(0);

    const redHome = root.querySelector('[data-node-id="n4-0"]');
    expect(redHome).toBeTruthy();
    redHome?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');

    const towardBlue = root.querySelector('[data-node-id="n3-0"]');
    towardBlue?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(ctrl.state.currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(ctrl.state.moveHistory[1]?.player).toBe('player2');
    expect(root.querySelectorAll('.kwa-selectable-chip').length).toBeGreaterThan(
      0
    );

    destroyGame();
  });
});
