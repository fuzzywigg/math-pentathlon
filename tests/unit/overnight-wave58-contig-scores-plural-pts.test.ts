/**
 * Wave 58 Contig/SD residual — Contig score chrome uses pts label. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — scores pts label', () => {
  it('Blue/Red score lines include pts', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/pts/);
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(/pts/);
  });
});
