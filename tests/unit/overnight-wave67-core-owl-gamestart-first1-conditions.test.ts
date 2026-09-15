/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — game-start-first-1 conditions', () => {
  it('pins firstTime true + high priority', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-first-1')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toEqual([{ type: 'firstTime', value: true }]);
  });
});
