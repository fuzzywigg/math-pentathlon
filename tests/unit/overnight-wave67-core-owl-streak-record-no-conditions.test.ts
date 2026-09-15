/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — streak-record-1 no conditions', () => {
  it('streak-record-1 has no conditions array', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:update')
      .find((m) => m.id === 'streak-record-1')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toBeUndefined();
  });
});
