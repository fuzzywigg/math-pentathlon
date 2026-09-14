/**
 * Overnight HEAVY leftover after #234 — Juggle shape selector header/options. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 52 juggle — shape selector options', () => {
  it('lists tromino options with category header', () => {
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
      currentDice: [3, 4] as [number, number],
      selectedCategory: 'tromino' as const,
    };
    const el = renderShapeSelector(s, () => undefined);
    expect(el.querySelector('.juggle-shape-header')?.textContent).toMatch(/tromino/i);
    expect(el.querySelectorAll('.juggle-shape-option').length).toBe(
      getShapesForDie(3).length
    );
  });
});
