/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — welcome firstTime conditions', () => {
  it('welcome-1/2/3 all require firstTime true', () => {
    for (const id of ['welcome-1', 'welcome-2', 'welcome-3']) {
      const msg = owlMessages
        .getMessagesByCategory('app:start')
        .find((m) => m.id === id)!;
      expect(msg.conditions).toEqual([{ type: 'firstTime', value: true }]);
      expect(msg.priority).toBe('high');
      expect(msg.category).toBe('app:start');
    }
  });
});
