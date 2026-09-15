/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 core owl — tutorial-complete-1 no conditions', () => {
  it('tutorial-complete-1 is high priority with no conditions', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:complete')
      .find((m) => m.id === 'tutorial-complete-1')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toBeUndefined();
  });
});
