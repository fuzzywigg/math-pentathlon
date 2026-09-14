/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl tutorial-complete-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — tutorial-complete-1 copy', () => {
  it('pins tutorial-complete practice invite template', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:complete')
      .find((m) => m.id === 'tutorial-complete-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      'Tutorial complete! You now know how to play {gameName}. Time to put it into practice!'
    );
  });
});
