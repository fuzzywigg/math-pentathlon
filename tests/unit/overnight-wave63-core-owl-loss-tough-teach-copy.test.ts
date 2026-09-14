/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl loss-encouraging-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — loss-encouraging-1 copy', () => {
  it('pins tough-game teaches loss text + playerWon false', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-1');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'That was a tough game! Every loss teaches us something. Want another go?'
    );
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: false }]);
  });
});
