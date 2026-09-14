/**
 * Overnight HEAVY leftover after #241 — game:end also emits streak:update when
 * storage currentStreak > 0. Distinct from mood-emit streak bus tests. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  storage.updateSettings({ owlEnabled: true });
  owlSystem.speakNow('flush-wave53', 'happy');
  owlSystem.dismissMessage();
  owlSystem.hide();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 53 core owl — streak:update after game end', () => {
  it('first recorded result emits streak:update with isNewRecord', () => {
    const streaks: Array<{ current: number; record: boolean }> = [];
    const unsub = owlSystem.getEvents().on('streak:update', (e) => {
      if (e.type === 'streak:update') {
        streaks.push({ current: e.currentStreak, record: e.isNewRecord });
      }
    });
    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 3 });
    expect(streaks).toHaveLength(1);
    expect(streaks[0].current).toBeGreaterThan(0);
    expect(streaks[0].record).toBe(true);
    expect(storage.getStreak().currentStreak).toBe(streaks[0].current);
    unsub();
  });
});
