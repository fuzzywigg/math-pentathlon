/**
 * Overnight HEAVY leftovers after #234 — Par55 selected hand class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — hand selected', () => {
  it('marks selected hand block after selectBlock', () => {
    const base = createInitialState();
    const id = base.hands.player1[0]!.id;
    const state = selectBlock(base, id);
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.querySelector('.par55-hand-block.selected')).toBeTruthy();
  });
});
