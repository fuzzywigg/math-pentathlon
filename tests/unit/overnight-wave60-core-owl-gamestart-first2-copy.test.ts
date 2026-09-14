/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl game-start-first-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — game-start-first-2 copy', () => {
  it('pins explore-not-winning first start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-first-2');
    expect(msg!.text).toBe(
      "Ooh, {gameName}! This is a great one. Don't worry about winning - just explore!"
    );
  });
});
