/**
 * Wave 49 — FIAR placed chip circle leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — chip circle', () => {
  it('draws inner chip circle after place', () => {
    let s = createInitialState();
    s = placeChip(s, '1-1');
    const svg = renderBoard(s, () => undefined);
    const g = svg.querySelector('[data-node-id="1-1"]')!;
    // bg + chip circles (+ optional shine ellipse)
    expect(g.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
    expect(g.querySelector('ellipse')).toBeTruthy();
  });
});
