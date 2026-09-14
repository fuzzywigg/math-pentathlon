/**
 * Wave 56 leftover after #243 — Contig controller opening scores residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, newGameVsHuman } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 56 contig — controller opening scores', () => {
  it('paints Blue/Red zero pts on init', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/Blue:/);
    expect(board.querySelector('.contig-score-p1')?.innerHTML).toMatch(
      /<strong>0<\/strong>\s*pts/
    );
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(/Red:/);
    expect(board.querySelector('.contig-score-p2')?.innerHTML).toMatch(
      /<strong>0<\/strong>\s*pts/
    );
  });
});
