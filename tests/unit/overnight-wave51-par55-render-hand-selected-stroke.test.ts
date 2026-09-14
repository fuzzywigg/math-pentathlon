/**
 * Wave 51 leftover after #233 — Par55 hand selected stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — hand selected', () => {
  it('marks selected hand block with class and #ff9800 stroke', () => {
    const base = createInitialState();
    const blockId = base.hands.player1[0].id;
    const state = selectBlock(base, blockId);
    const el = renderHand(state, 'player1', () => undefined);
    const selected = el.querySelector('.par55-hand-block.selected');
    expect(selected).toBeTruthy();
    const rect = selected?.querySelector('rect');
    expect(rect?.getAttribute('stroke')).toBe('#ff9800');
    expect(rect?.getAttribute('stroke-width')).toBe('3');
  });
});
