/**
 * Wave 56 leftover after #256 — Juggle selectingShape status after category set.
 * Engine-level instruction branch used by controller updateStatus. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  setAIDifficulty,
} from '../../src/games/juggle/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 56 juggle — controller setAIDifficulty export', () => {
  it('setAIDifficulty is callable after vs-AI mount without wiping roll chrome', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    setAIDifficulty('hard');
    expect(board.querySelector('.juggle-roll-btn')).toBeTruthy();
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Roll the dice/
    );
    setAIDifficulty('easy');
    expect(board.querySelector('.juggle-boards')).toBeTruthy();
  });
});
