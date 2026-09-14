/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle bottom-right empty aria I9.
 * Distinct from wave56 A1. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 58 juggle — empty aria I9', () => {
  it('labels bottom-right empty cell as I9', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(
      el
        .querySelector('[data-row="8"][data-col="8"]')
        ?.getAttribute('aria-label')
    ).toMatch(/I9/);
  });
});
