/**
 * Human block/base input must not succeed during the computer think pause.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeBlock,
  selectBlock,
} from '../../src/games/par-55/rules';
import { renderBoard, renderHand } from '../../src/games/par-55/board-ui';
import { installDomHooks } from './helpers/dom';

describe('Par 55 AI-turn input guard', () => {
  installDomHooks({ fakeTimers: true, styleIds: ['par55-styles'] });
  it('renderBoard with allowInput false does not mark valid bases', () => {
    let state = createInitialState();
    const blockId = state.hands.player1[0]!.id;
    state = selectBlock(state, blockId);
    expect(state.phase).toBe('placingBlock');
    expect(getValidPlacements(state).length).toBeGreaterThan(0);

    const el = renderBoard(state, () => undefined, { allowInput: false });
    expect(el.querySelectorAll('.par55-valid-base')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
  });

  it('renderHand with allowInput false disables current-player blocks', () => {
    const state = createInitialState();
    const el = renderHand(state, 'player1', () => undefined, {
      allowInput: false,
    });
    expect(el.querySelectorAll('.par55-hand-block.clickable')).toHaveLength(0);
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
  });

  it('blocks selecting a Red block during the AI think pause', async () => {
    const { newGameVsAI } =
      await import('../../src/games/par-55/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    const blueBlock = ctrl.state.hands.player1[0]!;
    let state = selectBlock(ctrl.state, blueBlock.id);
    const baseId = getValidPlacements(state)[0]!;
    state = placeBlock(state, baseId);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(root.querySelectorAll('.par55-valid-base')).toHaveLength(0);
    expect(root.querySelector('.par55-hand-block.clickable')).toBeNull();

    const redHand = root.querySelector('.par55-hand-player2');
    const redBlock = redHand?.querySelector('.par55-hand-block');
    redBlock?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedBlock).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(450);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(ctrl.state.moveHistory[1]?.player).toBe('player2');
  });
});
