/**
 * Wave 30 — calendar daily streak via updateStreak (YYYY-MM-DD continuum).
 * Distinct from per-game win streaks in streak-win. Deepens wave23 streak smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-streak-calendar — first / same-day / continue', () => {
  it('first play sets current=1, start=today, best=1', () => {
    vi.setSystemTime(new Date('2026-03-01T08:00:00Z'));
    const s = storage.updateStreak();
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.lastPlayDate).toBe('2026-03-01');
    expect(s.streakStartDate).toBe('2026-03-01');
  });

  it('same calendar day is a no-op for counters', () => {
    vi.setSystemTime(new Date('2026-03-01T08:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-03-01T23:59:00Z'));
    const same = storage.updateStreak();
    expect(same.currentStreak).toBe(1);
    expect(same.lastPlayDate).toBe('2026-03-01');
    expect(same.streakStartDate).toBe('2026-03-01');
  });

  it('consecutive days increment current and best', () => {
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-03-02T12:00:00Z'));
    const d2 = storage.updateStreak();
    expect(d2.currentStreak).toBe(2);
    expect(d2.bestStreak).toBe(2);
    expect(d2.lastPlayDate).toBe('2026-03-02');
    expect(d2.streakStartDate).toBe('2026-03-01');

    vi.setSystemTime(new Date('2026-03-03T12:00:00Z'));
    const d3 = storage.updateStreak();
    expect(d3.currentStreak).toBe(3);
    expect(d3.bestStreak).toBe(3);
  });
});

describe('Wave 30 storage-streak-calendar — break and rebuild', () => {
  it('gap of two+ days resets current but preserves best', () => {
    vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-04-02T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-04-03T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().bestStreak).toBe(3);

    vi.setSystemTime(new Date('2026-04-06T12:00:00Z'));
    const broken = storage.updateStreak();
    expect(broken.currentStreak).toBe(1);
    expect(broken.bestStreak).toBe(3);
    expect(broken.lastPlayDate).toBe('2026-04-06');
    expect(broken.streakStartDate).toBe('2026-04-06');
  });

  it('rebuild after break can exceed prior best', () => {
    vi.setSystemTime(new Date('2026-05-01T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-05-02T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().bestStreak).toBe(2);

    vi.setSystemTime(new Date('2026-05-10T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-05-11T12:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-05-12T12:00:00Z'));
    const peak = storage.updateStreak();
    expect(peak.currentStreak).toBe(3);
    expect(peak.bestStreak).toBe(3);
  });
});

describe('Wave 30 storage-streak-calendar — getStreak copy + recordGameResult hook', () => {
  it('getStreak returns a shallow copy', () => {
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
    storage.updateStreak();
    const a = storage.getStreak();
    a.currentStreak = 99;
    expect(storage.getStreak().currentStreak).toBe(1);
  });

  it('recordGameResult invokes updateStreak for the calendar day', () => {
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
    expect(storage.getStreak().currentStreak).toBe(0);
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 100,
      moveCount: 2,
      playedAt: Date.now(),
    });
    expect(storage.getStreak().currentStreak).toBe(1);
    expect(storage.getStreak().lastPlayDate).toBe('2026-06-15');
  });

  it('month boundary yesterday still continues the streak', () => {
    vi.setSystemTime(new Date('2026-01-31T18:00:00Z'));
    storage.updateStreak();
    vi.setSystemTime(new Date('2026-02-01T06:00:00Z'));
    const next = storage.updateStreak();
    expect(next.currentStreak).toBe(2);
    expect(next.lastPlayDate).toBe('2026-02-01');
    expect(next.streakStartDate).toBe('2026-01-31');
  });
});
