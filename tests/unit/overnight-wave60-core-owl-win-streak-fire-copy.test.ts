/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl win-streak-1 on-fire copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — win-streak-1 copy', () => {
  it('pins on-fire win-streak template', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-streak-1');
    expect(msg!.text).toBe(
      "{winStreak} wins in a row at {gameName}! You're on fire!"
    );
    expect(msg!.conditions).toEqual([
      { type: 'playerWon', value: true },
      { type: 'winStreak', value: 3, operator: 'gte' },
    ]);
  });
});
