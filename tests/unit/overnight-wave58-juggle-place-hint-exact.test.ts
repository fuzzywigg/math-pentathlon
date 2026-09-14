/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle place-controls hint exact.
 * Distinct from status "Place the shape on your board". Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 58 juggle — place hint exact', () => {
  it('shows exact board-place hint under controls', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
    const shape = SHAPE_POOLS.tromino[0];
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape,
        selectedCategory: 'tromino',
        currentDice: [3, 1],
      },
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('.juggle-hint')?.textContent).toBe(
      'Click on your board to place the shape'
    );
  });
});
