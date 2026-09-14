/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — tutorial-start-2 priority', () => {
  it('tutorial-start-2 is high priority with no conditions', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:start')
      .find((m) => m.id === 'tutorial-start-2')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toBeUndefined();
  });
});
