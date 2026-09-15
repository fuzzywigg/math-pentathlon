/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — game-start-generic-1 no conditions', () => {
  it('game-start-generic-1 has no conditions array', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-1')!;
    expect(msg.priority).toBe('normal');
    expect(msg.conditions).toBeUndefined();
  });
});
