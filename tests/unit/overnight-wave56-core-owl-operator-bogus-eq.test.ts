/**
 * Overnight HEAVY leftover after #256 — compareNumber unknown operator equals.
 * Distinct from wave55 omitted-operator eq and wave40 lt/gt matrix. Tests-only.
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

describe('Wave 56 core owl — bogus compare operator', () => {
  it('operator neq falls through to strict equality', () => {
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      storage.markMessageSeen(m.id);
    }
    owlMessages.addMessage({
      id: 'w56-op-bogus',
      category: 'streak:update',
      priority: 'high',
      text: 'exact-7',
      conditions: [{ type: 'streak', value: 7, operator: 'neq' }],
    });
    const hit = owlMessages.selectMessage('streak:update', { currentStreak: 7 });
    expect(hit?.id).toBe('w56-op-bogus');
    const miss = owlMessages.selectMessage('streak:update', { currentStreak: 8 });
    expect(miss?.id).not.toBe('w56-op-bogus');
  });
});
