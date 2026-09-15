/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — return-generic-2 no conditions', () => {
  it('return-generic-2 has no conditions array', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-generic-2')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toBeUndefined();
  });
});
