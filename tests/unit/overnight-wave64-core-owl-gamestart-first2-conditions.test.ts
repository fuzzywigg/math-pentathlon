/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — game-start-first-2 conditions', () => {
  it('pins firstTime true + high priority beside explore copy', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-first-2')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toEqual([{ type: 'firstTime', value: true }]);
  });
});
