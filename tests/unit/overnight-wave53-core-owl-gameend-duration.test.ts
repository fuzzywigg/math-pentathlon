/**
 * Overnight HEAVY leftover after #241 — game:end duration from gameStartTime.
 * Distinct from wave23 gamesWon increment. Tests-only.
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

describe('Wave 53 core owl — gameend duration', () => {
  it('duration equals elapsed ms between start and end', () => {
    vi.setSystemTime(new Date('2026-09-14T12:00:00.000Z'));
    let duration = -1;
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') duration = e.duration;
    });
    owlSystem.onGameStart(knownGameId);
    vi.advanceTimersByTime(2500);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 4 });
    expect(duration).toBe(2500);
    unsub();
  });
});
