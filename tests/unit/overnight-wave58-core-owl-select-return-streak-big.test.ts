/**
 * Overnight HEAVY leftover after #274 — app:return streak≥7 picks UNSTOPPABLE copy.
 * Distinct from wave53 streak-on-end / new-best. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 58 core owl — select return streak big', () => {
  it('currentStreak 7 yields UNSTOPPABLE after smaller streak is seen', () => {
    storage.markMessageSeen('return-streak-1');
    const msg = owlMessages.selectMessage('app:return', {
      currentStreak: 7,
      playerName: 'Ada',
    });
    expect(msg).toBeTruthy();
    expect(msg!.id).toBe('return-streak-big-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toMatch(/UNSTOPPABLE/i);
    expect(msg!.text).toMatch(/7/);
  });
});
