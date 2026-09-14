/**
 * Wave 51 leftover after #233 — Par55 lastMoveBaseId stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — last-move stroke', () => {
  it('uses #ff9800 stroke width 3 on lastMoveBaseId', () => {
    const base = createInitialState();
    const baseId = [...base.bases.keys()][0];
    const state = { ...base, lastMoveBaseId: baseId };
    const el = renderBoard(state, () => undefined);
    const poly = el.querySelector(`[data-base-id="${baseId}"] polygon`);
    expect(poly?.getAttribute('stroke')).toBe('#ff9800');
    expect(poly?.getAttribute('stroke-width')).toBe('3');
  });
});
