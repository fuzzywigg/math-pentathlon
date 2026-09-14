/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl game-start-generic-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — game-start-generic-2 copy', () => {
  it('pins every-move learn generic start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-2');
    expect(msg!.text).toBe(
      "Let's go! Remember, every move is a chance to learn something new!"
    );
  });
});
