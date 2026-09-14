/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — achievement-unlock no conditions', () => {
  it('achievement-unlock-1 has no conditions array', () => {
    const msg = owlMessages
      .getMessagesByCategory('achievement:unlock')
      .find((m) => m.id === 'achievement-unlock-1')!;
    expect(msg.conditions).toBeUndefined();
    expect(msg.priority).toBe('high');
  });
});
