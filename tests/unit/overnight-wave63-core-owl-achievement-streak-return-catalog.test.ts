/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl achievement/streak/return residual catalogs.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — achievement/streak/return catalogs', () => {
  it('achievement:unlock is a single high-priority stock row', () => {
    const rows = owlMessages.getMessagesByCategory('achievement:unlock');
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('achievement-unlock-1');
    expect(rows[0].priority).toBe('high');
  });

  it('streak:update includes streak-record-1 without conditions', () => {
    const ids = owlMessages
      .getMessagesByCategory('streak:update')
      .map((m) => m.id)
      .sort();
    expect(ids).toEqual(['streak-new-1', 'streak-record-1', 'streak-week-1']);
    const record = owlMessages
      .getMessagesByCategory('streak:update')
      .find((m) => m.id === 'streak-record-1')!;
    expect(record.conditions).toBeUndefined();
  });

  it('app:return includes return-generic-1 and return-streak-big-1', () => {
    const ids = owlMessages.getMessagesByCategory('app:return').map((m) => m.id);
    expect(ids).toContain('return-generic-1');
    expect(ids).toContain('return-streak-big-1');
    expect(ids).toHaveLength(9);
  });
});
