/**
 * Wave 57 leftover after #262 — Juggle winner banner copy via mono fill.
 * Distinct from inject CSS class-name only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Wave 57 juggle — winner banner copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    stubCanvas();
    vi.spyOn(Math, 'random').mockReturnValue(0); // always face 1 → monomino
  });

  it('renders filled-their-board winner banner after mono fill', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    // 81 P1 + 80 P2 mono placements → P1 fills first on 81st own place
    for (let i = 0; i < 161; i++) {
      if (status.querySelector('.juggle-winner-banner')) break;
      const roll = board.querySelector(
        '.juggle-roll-btn'
      ) as HTMLButtonElement | null;
      if (roll && !roll.disabled) roll.click();
      const die = board.querySelector('.juggle-die') as HTMLElement | null;
      die?.click();
      const empty = board.querySelector(
        '.juggle-board.active .juggle-cell:not([class*="occupied"])'
      ) as HTMLElement | null;
      empty?.click();
    }

    const banner = status.querySelector('.juggle-winner-banner');
    expect(banner?.textContent).toMatch(
      /filled their board first and wins!/
    );
    expect(banner?.textContent).toMatch(/🔵|🔴/);
  });
});
