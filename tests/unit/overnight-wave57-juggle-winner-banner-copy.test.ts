/**
 * Wave 57 leftover after #262 — Juggle winner banner copy.
 * Distinct from inject CSS class-name only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { initGame } from '../../src/games/juggle/game-controller';
import * as rules from '../../src/games/juggle/rules';

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
  });

  it('renders filled-their-board winner banner when winner is set', () => {
    vi.spyOn(rules, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    const banner = status.querySelector('.juggle-winner-banner');
    expect(banner?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      '🔵 Blue filled their board first and wins!'
    );
  });
});
