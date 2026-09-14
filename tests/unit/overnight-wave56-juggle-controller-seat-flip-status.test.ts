/**
 * Wave 56 leftover after #256 — Juggle controller seat flip status after place.
 * Exact Red rolling instruction after P1 mono place. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
} from '../../src/games/juggle/game-controller';

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 56 juggle — controller seat flip status', () => {
  it('after P1 mono place, status is Red rolling with player2 class', () => {
    stubCanvas();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    board.querySelector('.juggle-roll-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    (board.querySelectorAll('.juggle-die.selectable')[0] as HTMLElement).click();
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="4"][data-col="4"]'
    ) as HTMLElement;
    expect(cell).toBeTruthy();
    cell.click();

    const statusEl = status.querySelector('.juggle-status');
    expect(statusEl?.classList.contains('player2')).toBe(true);
    expect(statusEl?.textContent).toMatch(/Red's turn/);
    expect(statusEl?.textContent).toMatch(/Roll the dice/);
    expect(board.querySelector('.juggle-board.player2.active')).toBeTruthy();
    expect(board.querySelector('.juggle-board.player1.active')).toBeFalsy();
  });
});
