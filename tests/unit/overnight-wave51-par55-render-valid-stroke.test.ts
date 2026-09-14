/**
 * Wave 51 leftover after #233 — Par55 valid base stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, getValidPlacements } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — valid stroke', () => {
  it('uses #4caf50 stroke width 3 on valid bases', () => {
    const base = createInitialState();
    const blockId = base.hands.player1[0].id;
    const state = selectBlock(base, blockId);
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    const el = renderBoard(state, () => undefined);
    const poly = el.querySelector(`[data-base-id="${valids[0]}"] polygon`);
    expect(poly?.classList.contains('par55-valid-base')).toBe(true);
    expect(poly?.getAttribute('stroke')).toBe('#4caf50');
    expect(poly?.getAttribute('stroke-width')).toBe('3');
  });
});
