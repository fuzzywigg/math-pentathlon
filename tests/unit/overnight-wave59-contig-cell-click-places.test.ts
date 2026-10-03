/**
 * Wave 59 Contig/SD residual — Contig board click places via controller. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 59 contig — cell click place', () => {
  it('roll then click valid cell advances to opponent rolling', () => {
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
    const valid = board.querySelector('.contig-cell-valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.click();
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(status.textContent).toMatch(/Red's turn/);
  });
});
