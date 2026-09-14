/**
 * Wave 59 leftover after #279 — Juggle tromino shape-option display names.
 * Distinct from wave58 category headers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';
import { getShapesForDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 59 juggle — shape option names', () => {
  it('lists tromino pool names under .shape-name', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const el = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [3, 1],
        selectedCategory: 'tromino',
      },
      () => undefined
    );
    const names = [...el.querySelectorAll('.shape-name')].map(
      (n) => n.textContent
    );
    expect(names).toEqual(getShapesForDie(3).map((s) => s.name));
    expect(names).toEqual(expect.arrayContaining(['I-tromino', 'L-tromino']));
  });
});
