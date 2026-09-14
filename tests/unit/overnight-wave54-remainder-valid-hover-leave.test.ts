/**
 * Overnight HEAVY leftover after #241 — valid hover enter/leave. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — hover leave', () => {
  it('mouseenter id then mouseleave null', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const onHover = vi.fn();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 3, total: 6 },
      validIslands: [island.id],
    };
    const svg = renderBoard(state, () => undefined, onHover);
    const polys = svg.querySelectorAll(`[data-island-id="${island.id}"] polygon`);
    const hit = polys[polys.length - 1] as SVGPolygonElement;
    hit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    hit.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onHover.mock.calls.map((c) => c[0])).toEqual([island.id, null]);
  });
});
