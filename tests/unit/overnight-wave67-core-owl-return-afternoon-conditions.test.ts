/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — return-afternoon-1 conditions', () => {
  it('pins timeOfDay afternoon + normal priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-afternoon-1')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toEqual([{ type: 'timeOfDay', value: 'afternoon' }]);
  });
});
