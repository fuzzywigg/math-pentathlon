/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — loss-encouraging-5 conditions', () => {
  it('pins playerWon false + normal priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-5')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toEqual([{ type: 'playerWon', value: false }]);
  });
});
