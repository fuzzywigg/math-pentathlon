/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl game-start-return-2 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — game-start-return-2 copy', () => {
  it('pins gamesPlayed gte-3 return start template', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-return-2');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      "Back for more {gameName}? You're getting really good at this!"
    );
    expect(msg!.conditions).toEqual([
      { type: 'gamesPlayed', value: 3, operator: 'gte' },
    ]);
  });
});
