/**
 * Wave 55 leftover after #249/#250 — Fab answer click gated to confirmingMove. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — controller answer wrong phase', () => {
  it('opening answer click is a no-op on history and scores', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingBar1');
    const answer = container.querySelector('.fab-answer-wrapper');
    expect(answer).toBeTruthy();
    answer!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(ctrl.state.scores.player1).toBe(0);
    expect(ctrl.state.phase).toBe('selectingBar1');
  });
});
