/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — MESSAGE_LIBRARY category sizes', () => {
  it('pins stock sizes across event categories', () => {
    expect(owlMessages.getMessagesByCategory('app:start')).toHaveLength(3);
    expect(owlMessages.getMessagesByCategory('app:return')).toHaveLength(9);
    expect(owlMessages.getMessagesByCategory('game:start')).toHaveLength(8);
    expect(owlMessages.getMessagesByCategory('game:end')).toHaveLength(14);
    expect(owlMessages.getMessagesByCategory('tutorial:start')).toHaveLength(2);
    expect(owlMessages.getMessagesByCategory('tutorial:complete')).toHaveLength(2);
    expect(owlMessages.getMessagesByCategory('achievement:unlock')).toHaveLength(1);
    expect(owlMessages.getMessagesByCategory('streak:update')).toHaveLength(3);
    expect(owlMessages.getMessagesByCategory('streak:broken')).toHaveLength(2);
    expect(owlMessages.getMessagesByCategory('milestone:reached')).toHaveLength(3);
    expect(owlMessages.getMessagesByCategory('game:move')).toHaveLength(0);
  });
});
