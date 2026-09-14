/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl game-start-generic-4 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — game-start-generic-4 copy', () => {
  it('pins mathematicians-make-mistakes start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-4');
    expect(msg!.text).toBe(
      'Game time! Remember: mathematicians make mistakes, then learn from them!'
    );
  });
});
