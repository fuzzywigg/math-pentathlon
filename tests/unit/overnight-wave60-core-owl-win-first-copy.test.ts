/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl win-first-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — win-first-1 copy', () => {
  it('pins first-win celebration template + conditions', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-first-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      'YOU WON YOUR FIRST {gameName} GAME! This calls for a celebration!'
    );
    expect(msg!.conditions).toEqual([
      { type: 'playerWon', value: true },
      { type: 'gamesPlayed', value: 1 },
    ]);
  });
});
