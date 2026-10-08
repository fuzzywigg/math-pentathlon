/**
 * Stale AI setTimeout after New Game must not pass/place for Blue.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeBlock,
  selectBlock,
} from '../../src/games/par-55/rules';
import { installDomHooks } from './helpers/dom';

describe('Par 55 AI timer race / New Game generation', () => {
  installDomHooks({ fakeTimers: true, styleIds: ['par55-styles'] });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('New Game during AI pause leaves a clean Blue select seat (no history)', async () => {
    const { newGameVsAI } =
      await import('../../src/games/par-55/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'medium');

    const blueBlock = ctrl.state.hands.player1[0]!;
    let state = selectBlock(ctrl.state, blueBlock.id);
    const baseId = getValidPlacements(state)[0]!;
    state = placeBlock(state, baseId);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(root.querySelector('.par55-status')?.textContent).toMatch(
      /Computer is thinking/
    );

    // Remount via public API (shell New Game path) while AI timer is pending.
    const fresh = newGameVsAI(root, 'medium');
    expect(fresh.state.moveHistory).toHaveLength(0);
    expect(fresh.state.currentPlayer).toBe('player1');
    expect(root.querySelector('.par55-status')?.textContent).toMatch(
      /Tap a block from your hand/
    );

    await vi.advanceTimersByTimeAsync(2000);

    expect(fresh.state.moveHistory).toHaveLength(0);
    expect(fresh.state.currentPlayer).toBe('player1');
    expect(root.querySelectorAll('.par55-history-move')).toHaveLength(0);
    expect(root.querySelector('.par55-hand-block.clickable')).toBeTruthy();
  });

  it('makeAIMove no-ops when it is Blue’s seat (stale callback)', async () => {
    const { newGameVsAI } =
      await import('../../src/games/par-55/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    // Force Red seat so a timer is scheduled, then flip seat before it fires.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();

    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'selectingBlock',
    };
    // Do not call update — leave the pending timer aimed at a Blue seat.
    await vi.advanceTimersByTimeAsync(2000);

    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory).toHaveLength(0);
  });
});
