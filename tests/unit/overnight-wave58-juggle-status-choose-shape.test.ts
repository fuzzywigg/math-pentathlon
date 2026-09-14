/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle Choose a shape status after category.
 * Distinct from die-category / placing instructions. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

afterEach(() => vi.restoreAllMocks());

describe('Wave 58 juggle — status choose shape', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
    // Faces 3 and 4 → tromino / tetromino (multi-shape pools; no auto-place)
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const seq = [2 / 6, 3 / 6]; // floor(x*6)+1 → 3, 4
      return seq[n++ % 2]!;
    });
  });

  it('after selecting a multi-shape die shows Choose a shape', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    const trominoDie = [
      ...board.querySelectorAll('.juggle-die-container'),
    ].find((c) => c.textContent?.includes('Tromino'))
      ?.querySelector('.juggle-die') as HTMLElement;
    expect(trominoDie).toBeTruthy();
    trominoDie.click();
    expect(status.textContent).toMatch(/Choose a shape/);
    expect(status.textContent).not.toMatch(
      /Click a die to choose shape category/
    );
  });
});
