/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl game-start-return-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — game-start-return-1 copy', () => {
  it('pins gamesPlayed gte-5 return start template', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-return-1');
    expect(msg!.text).toBe(
      '{gameName} again! I can see you really like this one!'
    );
    expect(msg!.conditions).toEqual([
      { type: 'gamesPlayed', value: 5, operator: 'gte' },
    ]);
  });
});
