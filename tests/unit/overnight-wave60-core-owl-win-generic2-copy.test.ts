/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl win-generic-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — win-generic-2 copy', () => {
  it('pins winner-winner hoot win text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-2');
    expect(msg!.text).toBe(
      'Hoot hoot! Winner winner! That was some impressive play!'
    );
  });
});
