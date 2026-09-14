/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl app:start catalog size/ids.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — app:start catalog', () => {
  it('app:start exposes exactly welcome-1/2/3 high priority', () => {
    const start = owlMessages.getMessagesByCategory('app:start');
    expect(start.map((m) => m.id).sort()).toEqual([
      'welcome-1',
      'welcome-2',
      'welcome-3',
    ]);
    expect(start.every((m) => m.priority === 'high')).toBe(true);
  });
});
