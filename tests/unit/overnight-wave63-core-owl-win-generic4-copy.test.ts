/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl win-generic-4 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — win-generic-4 copy', () => {
  it('pins brilliant-moves win celebration + playerWon condition', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-4');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe("Brilliant moves! I knew you had it in you!");
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: true }]);
  });
});
