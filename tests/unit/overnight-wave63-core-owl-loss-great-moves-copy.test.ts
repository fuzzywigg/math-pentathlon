/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl loss-encouraging-2 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — loss-encouraging-2 copy', () => {
  it('pins great-moves loss text + playerWon false', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-2');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'Not this time, but I saw some great moves in there! Try again?'
    );
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: false }]);
  });
});
