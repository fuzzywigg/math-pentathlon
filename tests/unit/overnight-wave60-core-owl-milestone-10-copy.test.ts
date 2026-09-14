/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl milestone-games-10 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — milestone-games-10 copy', () => {
  it('pins ten-games getting-into milestone text', () => {
    const msg = owlMessages
      .getMessagesByCategory('milestone:reached')
      .find((m) => m.id === 'milestone-games-10');
    expect(msg!.text).toBe(
      "10 games played! You're really getting into Math Pentathlon!"
    );
  });
});
