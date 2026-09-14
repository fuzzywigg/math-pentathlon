/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl tutorial catalog residual ids.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — tutorial catalog residual', () => {
  it('tutorial:start/complete each expose *-1 alongside wave60 *-2', () => {
    expect(
      owlMessages.getMessagesByCategory('tutorial:start').map((m) => m.id).sort()
    ).toEqual(['tutorial-start-1', 'tutorial-start-2']);
    expect(
      owlMessages
        .getMessagesByCategory('tutorial:complete')
        .map((m) => m.id)
        .sort()
    ).toEqual(['tutorial-complete-1', 'tutorial-complete-2']);
    expect(
      owlMessages
        .getMessagesByCategory('tutorial:start')
        .concat(owlMessages.getMessagesByCategory('tutorial:complete'))
        .every((m) => m.priority === 'high')
    ).toBe(true);
  });
});
