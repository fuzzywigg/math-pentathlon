/**
 * Wave 57 leftover after #257 — FIAR newGameVsHuman owl start. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { owlSystem } from '../../src/core/owl';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 57 fiar — human owl start', () => {
  it('newGameVsHuman notifies owl and clears AI chrome', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    expect(app.dataset.opponent).toBe('ai');

    const start = vi.spyOn(owlSystem, 'onGameStart');
    newGameVsHuman();
    expect(start).toHaveBeenCalledWith('fiar');
    expect(app.dataset.opponent).not.toBe('ai');
    expect(getCurrentState().phase).toBe('placement');
    expect(getCurrentState().chipsPlaced.player1).toBe(0);
  });
});
