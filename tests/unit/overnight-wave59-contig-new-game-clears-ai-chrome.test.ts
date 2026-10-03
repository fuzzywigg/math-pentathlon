/**
 * Wave 59 Contig/SD residual — Contig newGameVsHuman clears AI chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
} from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — clear AI chrome', () => {
  it('newGameVsHuman clears opponent dataset after AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');
    newGameVsHuman();
    expect(app.dataset.opponent || '').not.toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
  });
});
