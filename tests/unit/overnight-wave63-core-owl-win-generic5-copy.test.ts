/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl win-generic-5 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — win-generic-5 copy', () => {
  it('pins champion another-win invite + playerWon condition', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-5');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe('Champion! Want to try for another win?');
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: true }]);
  });
});
