/**
 * Wave 57 leftover after #267 — Contig opening scores Blue/Red 0 pts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — opening scores', () => {
  it('renders Blue/Red score shells at 0 pts', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(
      /Blue:.*0.*pts/
    );
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(
      /Red:.*0.*pts/
    );
  });
});
