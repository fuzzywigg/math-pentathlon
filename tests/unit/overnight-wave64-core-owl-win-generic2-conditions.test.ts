/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — win-generic-2 conditions', () => {
  it('pins playerWon true + normal priority beside hoot copy', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-2')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toEqual([{ type: 'playerWon', value: true }]);
  });
});
