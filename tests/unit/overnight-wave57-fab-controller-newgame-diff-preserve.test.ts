/**
 * Wave 57 leftover after #257 — Fab newGame preserves difficulty. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsAI } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 57 fab — newGame diff preserve', () => {
  it('newGame(true) without diff keeps prior aiDifficulty', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsAI(container, 'easy');
    expect(ctrl.aiDifficulty).toBe('easy');

    ctrl.newGame(true);
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(ctrl.state.phase).toBe('selectingBar1');
    expect(app.dataset.opponent).toBe('ai');
  });
});
