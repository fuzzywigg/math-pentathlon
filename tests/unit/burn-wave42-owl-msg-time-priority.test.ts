/**
 * Wave 42 — owl messages timeOfDay + priority selection leftovers.
 * Tests-only.
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

describe('Wave 42 owl-msg — time priority', () => {
  it('morning context can select morning-conditioned return copy', () => {
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Ada',
      timeOfDay: 'morning',
      currentStreak: 0,
    });
    expect(msg).toBeTruthy();
    expect(msg!.text.toLowerCase()).toMatch(/morning|welcome|math|ada/);
  });

  it('high-priority streak message preferred when streak qualifies', () => {
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Ada',
      timeOfDay: 'afternoon',
      currentStreak: 8,
    });
    expect(msg).toBeTruthy();
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toMatch(/streak|UNSTOPPABLE|days/i);
  });

  it('selectMessage substitutes playerName placeholder', () => {
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Zig',
      timeOfDay: 'evening',
      currentStreak: 0,
    });
    expect(msg).toBeTruthy();
    // either contains Zig or is unconditional without placeholder
    if (msg!.text.includes('{playerName}')) {
      expect.fail('placeholder should be formatted');
    }
    expect(msg!.text.length).toBeGreaterThan(5);
  });

  it('night-conditioned messages appear in catalog', () => {
    const night = owlMessages
      .getMessagesByCategory('app:return')
      .filter((m) =>
        m.conditions?.some(
          (c) => c.type === 'timeOfDay' && c.value === 'night'
        )
      );
    expect(night.length).toBeGreaterThan(0);
  });

  it('high priority messages exist for app:start', () => {
    const highs = owlMessages
      .getMessagesByCategory('app:start')
      .filter((m) => m.priority === 'high');
    expect(highs.length).toBeGreaterThan(0);
  });
});
