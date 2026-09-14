/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl tutorial-complete-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — tutorial-complete-2 copy', () => {
  it('pins mastered-basics tutorial complete text', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:complete')
      .find((m) => m.id === 'tutorial-complete-2');
    expect(msg!.text).toBe(
      "You've mastered the basics of {gameName}! Ready for a real game?"
    );
  });
});
