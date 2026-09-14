/**
 * Wave 56 leftover after #255/#256 — Fab controller.newGame vsAI toggle. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 56 fab — newGame vsAI', () => {
  it('newGame(true) sets AI seat player2 and opponent chrome', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();

    ctrl.newGame(true, 'hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(ctrl.state.phase).toBe('selectingBar1');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(app.dataset.opponent).toBe('ai');
  });
});
