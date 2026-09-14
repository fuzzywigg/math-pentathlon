/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — draw pair no conditions', () => {
  it('draw-1/2 are unconditional normal priority', () => {
    for (const id of ['draw-1', 'draw-2']) {
      const msg = owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === id)!;
      expect(msg.priority).toBe('normal');
      expect(msg.conditions).toBeUndefined();
    }
  });
});
