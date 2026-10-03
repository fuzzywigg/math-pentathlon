/**
 * Wave 58 Contig/SD residual — Contig newGameVsAI chrome + scores. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, newGameVsAI } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — newGameVsAI chrome', () => {
  it('resets scores to 0 and keeps roll CTA', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/0/);
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(/0/);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(app.getAttribute('data-game-mode') || app.className).toBeTruthy();
  });
});
