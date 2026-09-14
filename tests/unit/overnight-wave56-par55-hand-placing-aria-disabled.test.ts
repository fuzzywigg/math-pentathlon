/**
 * Wave 56 leftover after #256 — Par 55 placing hand aria-disabled. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 56 par55 — hand aria-disabled', () => {
  it('after selectBlock current hand blocks are aria-disabled', () => {
    const s = createInitialState();
    const placing = selectBlock(s, s.hands.player1[0]!.id);
    const hand = renderHand(placing, 'player1', () => undefined);
    const blocks = hand.querySelectorAll('.par55-hand-block');
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of Array.from(blocks)) {
      expect(b.getAttribute('aria-disabled')).toBe('true');
    }
  });
});
