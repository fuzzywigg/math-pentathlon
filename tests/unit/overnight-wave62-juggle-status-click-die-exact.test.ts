/**
 * Wave 62 leftover after #293 — Juggle post-roll Click a die status exact seat.
 * Tightens wave56 soft /Click a die/. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

afterEach(() => vi.restoreAllMocks());

describe('Wave 62 juggle — status click-die exact seat', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const seq = [2 / 6, 3 / 6]; // 3,4 → multi-shape pools
      return seq[n++ % 2]!;
    });
  });

  it('after roll shows exact Blue click-die instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    expect(status.querySelector('.juggle-status')?.textContent?.trim()).toBe(
      "🔵 Blue's turn - Click a die to choose shape category"
    );
  });
});
