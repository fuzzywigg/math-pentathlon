/**
 * Wave 67 leftover after tip/#324 — Kwatro node/chip radii 22/18.
 * No prior r locks; deepen NODE_RADIUS/CHIP_RADIUS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 67 kwatro — render node chip radii', () => {
  it('empty node r=22 and chip circle r=18', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const empty = el.querySelector('[data-node-id="n2-2"] > circle');
    expect(empty?.getAttribute('r')).toBe('22');
    const chipNode = el.querySelector('[data-node-id="n0-0"]');
    const chipCircle = [...(chipNode?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('stroke') === '#333'
    );
    expect(chipCircle?.getAttribute('r')).toBe('18');
  });
});
