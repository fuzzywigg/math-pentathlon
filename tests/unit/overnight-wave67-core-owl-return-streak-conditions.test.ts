/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — return-streak-1 conditions', () => {
  it('pins streak gte-2 + high priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-streak-1')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toEqual([{ type: 'streak', value: 2, operator: 'gte' }]);
  });
});
