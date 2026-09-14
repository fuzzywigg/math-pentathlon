/**
 * Wave 56 leftover after #256 — Ramrod placed rod width uses CM_SCALE=10.
 * Distinct from wave52 legend *8 widths. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod } from '../../src/games/ramrod/types';

describe('Wave 56 ramrod — placed rod width', () => {
  it('renders a length-3 placed rod at 30px', () => {
    const s = createInitialState();
    const rod: Rod = {
      id: 'placed-3',
      length: 3,
      color: '#8bc34a',
      owner: 'player1',
      position: { boxId: 'box-0-0', slot: 0 },
    };
    const box = s.boxes.get('box-0-0')!;
    s.boxes.set('box-0-0', {
      ...box,
      rods: [rod, null],
    });
    s.rods.set(rod.id, rod);
    const el = renderBoard(s, () => undefined);
    const placed = el.querySelector('.ramrod-slot .ramrod-rod') as HTMLElement;
    expect(placed?.style.width).toBe('30px');
    expect(placed?.classList.contains('in-hand')).toBe(false);
  });
});
