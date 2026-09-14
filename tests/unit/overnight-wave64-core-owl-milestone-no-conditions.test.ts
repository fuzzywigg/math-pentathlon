/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — milestone no conditions', () => {
  it('milestone 10/50/100 rows carry no conditions', () => {
    const rows = owlMessages.getMessagesByCategory('milestone:reached');
    expect(rows).toHaveLength(3);
    expect(rows.every((m) => m.conditions === undefined)).toBe(true);
    expect(rows.every((m) => m.priority === 'high')).toBe(true);
  });
});
