/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle shape headers for all categories.
 * Distinct from wave56 tromino-only header. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';
import type { ShapeCategory } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

const FACE: Record<ShapeCategory, number> = {
  monomino: 1,
  domino: 2,
  tromino: 3,
  tetromino: 4,
  pentomino: 5,
};

describe('Wave 58 juggle — shape headers all cats', () => {
  it.each([
    ['monomino', 'Choose a monomino:'],
    ['domino', 'Choose a domino:'],
    ['tetromino', 'Choose a tetromino:'],
    ['pentomino', 'Choose a pentomino:'],
  ] as const)('header for %s is exact', (cat, header) => {
    stubCanvas();
    const face = FACE[cat];
    const el = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [face, 1],
        selectedCategory: cat,
      },
      () => undefined
    );
    expect(el.querySelector('.juggle-shape-header')?.textContent).toBe(header);
  });
});
