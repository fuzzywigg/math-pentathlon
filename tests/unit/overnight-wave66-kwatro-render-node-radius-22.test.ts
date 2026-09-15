/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro node circle radius 22.
 * Wave55 locks empty fill; deepen NODE_RADIUS r=22. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render node radius 22', () => {
  it('empty mid node circle has r=22', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const mid = el.querySelector('[data-node-id="n2-2"] circle');
    expect(mid?.getAttribute('r')).toBe('22');
  });
});
