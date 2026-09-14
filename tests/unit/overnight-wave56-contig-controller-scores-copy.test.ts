/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig controller scores copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 56 contig — controller scores copy', () => {
  it('score chips use Blue/Red pts leftover', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/Blue:/);
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/pts/);
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(/Red:/);
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(/pts/);
  });
});
