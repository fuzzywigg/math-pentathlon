/**
 * Wave 56 leftover after #255/#256 — FIAR newGameVsAI + owl onGameStart. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
  setAIDifficulty,
} from '../../src/games/fiar/game-controller';
import { owlSystem } from '../../src/core/owl';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 56 fiar — newGameVsAI owl', () => {
  it('notifies onGameStart, sets AI chrome, setAIDifficulty round-trips', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    const start = vi.spyOn(owlSystem, 'onGameStart');
    newGameVsAI('easy');
    expect(start).toHaveBeenCalledWith('fiar');
    expect(app.dataset.opponent).toBe('ai');
    expect(getCurrentState().phase).toBe('placement');
    expect(getCurrentState().chipsPlaced.player1).toBe(0);

    setAIDifficulty('hard');
    expect(getCurrentState().phase).toBe('placement');
  });
});
