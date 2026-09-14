/**
 * Wave 59 Contig/SD residual — Contig no pass warning at zero. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — pass warning absent', () => {
  it('opening status omits /3 passes suffix', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).not.toMatch(/\/3 passes/);
  });
});
