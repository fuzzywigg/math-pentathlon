/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl win-generic-1 VICTORY copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — win-generic-1 copy', () => {
  it('pins VICTORY strategic-thinking win text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-1');
    expect(msg!.text).toBe(
      'VICTORY! Your strategic thinking really paid off!'
    );
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: true }]);
  });
});
