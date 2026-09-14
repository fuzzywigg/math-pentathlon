/**
 * Overnight HEAVY leftover after #241 — invalid island cursor not-allowed. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — invalid cursor', () => {
  it('non-valid selectIsland hit uses not-allowed and no click', () => {
    const base = createInitialState();
    const valid = base.islands[0]!;
    const other = base.islands[1]!;
    const onClick = vi.fn();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 1, total: 2 },
      validIslands: [valid.id],
    };
    const svg = renderBoard(state, onClick, () => undefined);
    const polys = svg.querySelectorAll(`[data-island-id="${other.id}"] polygon`);
    const hit = polys[polys.length - 1] as SVGPolygonElement;
    expect(hit.style.cursor).toBe('not-allowed');
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
