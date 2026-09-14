/**
 * Overnight HEAVY leftover after #241 — valid hit-area click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — valid click', () => {
  it('transparent hit polygon fires onIslandClick', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const onClick = vi.fn();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 2, total: 4 },
      validIslands: [island.id],
    };
    const svg = renderBoard(state, onClick, () => undefined);
    const polys = svg.querySelectorAll(`[data-island-id="${island.id}"] polygon`);
    expect(polys.length).toBeGreaterThanOrEqual(2);
    const hit = polys[polys.length - 1] as SVGPolygonElement;
    expect(hit.getAttribute('fill')).toBe('transparent');
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(island.id);
  });
});
