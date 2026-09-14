/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — return-night-1 conditions', () => {
  it('pins timeOfDay night + normal priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-night-1')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toEqual([{ type: 'timeOfDay', value: 'night' }]);
  });
});
