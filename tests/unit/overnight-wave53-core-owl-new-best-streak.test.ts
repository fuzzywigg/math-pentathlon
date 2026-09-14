/**
 * Overnight HEAVY leftover after #241 — isNewBestStreak after a prior best + loss.
 * Distinct from wave23 player1 win stats. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';
import type { GameEndEvent } from '../../src/core/owl';

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

describe('Wave 53 core owl — isNewBestStreak', () => {
  it('first win is a new best; later win after loss is not', () => {
    const flags: boolean[] = [];
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        flags.push((e as GameEndEvent).isNewBestStreak);
      }
    });

    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 4 });
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 5 });
    owlSystem.onGameEnd(knownGameId, { winner: 'ai', moveCount: 6 });
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 3 });

    expect(flags).toEqual([true, true, false, false]);
    expect(storage.getGameStats(knownGameId).bestWinStreak).toBe(2);
    expect(storage.getGameStats(knownGameId).currentWinStreak).toBe(1);
    unsub();
  });
});
