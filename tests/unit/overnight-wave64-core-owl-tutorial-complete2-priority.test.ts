/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — tutorial-complete-2 priority', () => {
  it('tutorial-complete-2 is high priority with no conditions', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:complete')
      .find((m) => m.id === 'tutorial-complete-2')!;
    expect(msg.priority).toBe('high');
    expect(msg.conditions).toBeUndefined();
    expect(msg.text).toBe(
      "You've mastered the basics of {gameName}! Ready for a real game?"
    );
  });
});
