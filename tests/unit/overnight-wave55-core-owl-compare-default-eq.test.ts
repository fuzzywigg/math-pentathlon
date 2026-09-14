/**
 * Overnight HEAVY leftover after #250 — compareNumber with omitted operator
 * is strict equality. Distinct from wave40 lt/gt/lte matrix. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  storage.markMessageSeen('streak-record-1');
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 55 core owl — default compare operator', () => {
  it('streak condition without operator equals only the exact value', () => {
    owlMessages.addMessage({
      id: 'w55-streak-default-eq',
      category: 'streak:update',
      priority: 'high',
      text: 'exact-11',
      conditions: [{ type: 'streak', value: 11 }],
    });
    const hit = owlMessages.selectMessage('streak:update', {
      currentStreak: 11,
    });
    expect(hit?.id).toBe('w55-streak-default-eq');
    const miss = owlMessages.selectMessage('streak:update', {
      currentStreak: 12,
    });
    expect(miss?.id).not.toBe('w55-streak-default-eq');
  });
});
