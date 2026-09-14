/**
 * Overnight HEAVY leftover after #234 — Juggle shape option click callback. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 52 juggle — shape selector click', () => {
  it('invokes onSelectShape when an option is clicked', () => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
    };
    vi.spyOn(proto, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const onSelect = vi.fn();
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 2] as [number, number],
      selectedCategory: 'domino' as const,
    };
    const el = renderShapeSelector(s, onSelect);
    const opt = el.querySelector('.juggle-shape-option') as HTMLElement;
    expect(opt).toBeTruthy();
    opt.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ size: 2 });
  });
});
