/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl loss-encouraging-4 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — loss-encouraging-4 copy', () => {
  it('pins close-game loss text + playerWon false', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-4');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'Close game! A few different moves and it could have been yours!'
    );
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: false }]);
  });
});
