/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — loss-encouraging-2 conditions', () => {
  it('pins playerWon false + normal priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-2')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toEqual([{ type: 'playerWon', value: false }]);
  });
});
