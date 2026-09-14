/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-morning-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-morning-1 copy', () => {
  it('pins morning return template + timeOfDay condition', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-morning-1');
    expect(msg!.text).toBe(
      'Good morning, {playerName}! Ready for some brain-boosting math fun?'
    );
    expect(msg!.conditions).toEqual([
      { type: 'timeOfDay', value: 'morning' },
    ]);
  });
});
