/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — streak-broken no conditions', () => {
  it('streak-broken-1/2 are unconditional normal priority', () => {
    const rows = owlMessages.getMessagesByCategory('streak:broken');
    expect(rows.map((m) => m.id).sort()).toEqual([
      'streak-broken-1',
      'streak-broken-2',
    ]);
    expect(rows.every((m) => m.priority === 'normal')).toBe(true);
    expect(rows.every((m) => m.conditions === undefined)).toBe(true);
  });
});
