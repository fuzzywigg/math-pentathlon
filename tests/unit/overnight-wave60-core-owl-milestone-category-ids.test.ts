/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl milestone category id catalog.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — milestone category ids', () => {
  it('milestone:reached exposes exactly 10/50/100 ids', () => {
    const ms = owlMessages.getMessagesByCategory('milestone:reached');
    expect(ms.map((m) => m.id).sort()).toEqual([
      'milestone-games-10',
      'milestone-games-100',
      'milestone-games-50',
    ]);
    expect(ms).toHaveLength(3);
    expect(ms.every((m) => m.priority === 'high')).toBe(true);
  });
});
