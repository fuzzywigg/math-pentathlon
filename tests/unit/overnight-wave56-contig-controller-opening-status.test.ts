/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig controller opening status. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 56 contig — controller opening status', () => {
  it('opening status rolls dice on Blue leftover', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);
    expect(status.textContent).toMatch(/Blue's turn/);
    expect(status.textContent).toMatch(/Roll the dice to start your turn/);
  });
});
