/**
 * Wave 56 leftover after #256 — Juggle shape selector header for pentomino die.
 * Distinct from wave52 tromino options leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 56 juggle — shape selector pentomino header', () => {
  it('lists pentomino options with exact Choose a pentomino header', () => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
    };
    vi.spyOn(proto, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [5, 2] as [number, number],
      selectedCategory: 'pentomino' as const,
    };
    const el = renderShapeSelector(s, () => undefined);
    expect(el.querySelector('.juggle-shape-header')?.textContent).toBe(
      'Choose a pentomino:'
    );
    expect(el.querySelectorAll('.juggle-shape-option').length).toBe(
      getShapesForDie(5).length
    );
    expect(el.querySelector('.shape-name')?.textContent?.length).toBeGreaterThan(0);
  });
});
