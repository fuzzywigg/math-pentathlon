/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro empty node stroke-width 1.
 * Wave55 locks #f5f5f5/#ccc fill; deepen stroke-width 1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render empty stroke-width 1', () => {
  it('middle empty node stroke-width is 1', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const mid = el.querySelector('[data-node-id="n2-2"] circle');
    expect(mid?.getAttribute('stroke-width')).toBe('1');
  });
});
