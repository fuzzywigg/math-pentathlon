/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder chip badge geometry. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — chip badge geometry', () => {
  it('chips>0 badge circle r=12 fill/stroke leftover', () => {
    const base = createInitialState();
    const islands = base.islands.map((isl, i) =>
      i === 0 ? { ...isl, chips: 3, owner: 'player1' as const } : isl
    );
    const el = renderBoard({ ...base, islands }, () => undefined);
    const circle = el.querySelector('circle');
    expect(circle?.getAttribute('r')).toBe('12');
    expect(circle?.getAttribute('fill')).toBe('#fff');
    expect(circle?.getAttribute('stroke')).toBe('#333');
    expect(circle?.getAttribute('stroke-width')).toBe('2');
  });
});
