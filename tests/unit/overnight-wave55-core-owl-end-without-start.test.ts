/**
 * Overnight HEAVY leftover after #250 — onGameEnd with never-started clock
 * uses gameStartTime 0. Distinct from wave53 elapsed-between-start-end. Tests-only.
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
  owlSystem.speakNow('flush-wave55', 'happy');
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

describe('Wave 55 core owl — end without start', () => {
  it('records a loss and emits game:end without a matching onGameStart', () => {
    let duration = -1;
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') duration = e.duration;
    });
    owlSystem.onGameEnd(knownGameId, { winner: 'player2', moveCount: 1 });
    expect(duration).toBeGreaterThanOrEqual(0);
    expect(storage.getGameStats(knownGameId).gamesLost).toBe(1);
    expect(storage.getGameStats(knownGameId).gamesWon).toBe(0);
    unsub();
  });
});
