/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — win-streak-1 conditions', () => {
  it('pins playerWon true + winStreak gte-3 dual conditions', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-streak-1')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toEqual([{ type: 'playerWon', value: true }, { type: 'winStreak', value: 3, operator: 'gte' }]);
  });
});
