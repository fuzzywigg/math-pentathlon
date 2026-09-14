/**
 * Overnight HEAVY leftover after #250 — firstTime:false matches only when
 * gamesPlayedThisGame !== 0. Distinct from wave23 first-time welcome. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 55 core owl — firstTime false condition', () => {
  it('inject matches returning play; misses true first session', () => {
    owlMessages.addMessage({
      id: 'w55-firsttime-false',
      category: 'game:start',
      priority: 'high',
      text: 'returning-only',
      conditions: [{ type: 'firstTime', value: false }],
    });
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.id !== 'w55-firsttime-false') storage.markMessageSeen(m.id);
    }
    const returning = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 3,
    });
    expect(returning?.text).toBe('returning-only');

    const first = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 0,
    });
    expect(first?.text).not.toBe('returning-only');
  });
});
