/**
 * Wave 59 Contig/SD residual — Contig sync chrome noop without #app. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, newGameVsAI } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — sync chrome no app', () => {
  it('newGameVsAI without #app does not throw', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(() => newGameVsAI('easy')).not.toThrow();
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
  });
});
