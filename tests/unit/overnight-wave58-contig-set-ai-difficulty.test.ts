/**
 * Wave 58 Contig/SD residual — Contig setAIDifficulty export. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  setAIDifficulty,
  newGameVsAI,
} from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — setAIDifficulty', () => {
  it('accepts hard then newGameVsAI mounts roll chrome', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(() => setAIDifficulty('hard')).not.toThrow();
    newGameVsAI('hard');
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(status.querySelector('.contig-status')?.textContent).toContain(
      "Blue's turn"
    );
  });
});
