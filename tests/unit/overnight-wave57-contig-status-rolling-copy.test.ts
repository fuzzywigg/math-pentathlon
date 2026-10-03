/**
 * Wave 57 leftover after #267 — Contig rolling status exact copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — status rolling copy', () => {
  it('opening status is Blue turn + roll instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    const text = status.querySelector('.contig-status.player1')?.textContent ?? '';
    expect(text).toMatch(/Blue's turn/);
    expect(text).toContain('Roll the dice to start your turn');
  });
});
