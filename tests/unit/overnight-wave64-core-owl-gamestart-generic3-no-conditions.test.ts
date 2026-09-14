/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — game-start-generic-3 no conditions', () => {
  it('generic-3 is unconditional normal priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-3')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toBeUndefined();
  });
});
