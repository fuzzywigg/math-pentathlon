/**
 * Wave 59 Contig/SD residual — Contig expr option click places. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 59 contig — expr option place', () => {
  it('clicking expr option after roll flips seat', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.0, 0.16, 0.33];
      const v = vals[n % 3]!;
      n += 1;
      return v;
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const opt = board.querySelector('.contig-expr-option') as HTMLButtonElement | null;
    expect(opt).toBeTruthy();
    opt!.click();
    expect(status.textContent).toMatch(/Red's turn/);
    expect(board.querySelector('.contig-cell-p1')).toBeTruthy();
  });
});
