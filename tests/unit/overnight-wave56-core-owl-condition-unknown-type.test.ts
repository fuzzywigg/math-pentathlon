/**
 * Overnight HEAVY leftover after #256 — checkCondition unknown type defaults true.
 * Distinct from wave55 firstTime/compare ops. Tests-only.
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

describe('Wave 56 core owl — unknown condition type', () => {
  it('unrecognized condition type still matches the message', () => {
    owlMessages.addMessage({
      id: 'w56-cond-unknown',
      category: 'game:move',
      priority: 'high',
      text: 'unknown-type-ok',
      conditions: [{ type: 'zzz' as 'streak', value: 1 }],
    });
    const hit = owlMessages.selectMessage('game:move', {});
    expect(hit?.id).toBe('w56-cond-unknown');
    expect(hit?.text).toBe('unknown-type-ok');
  });
});
