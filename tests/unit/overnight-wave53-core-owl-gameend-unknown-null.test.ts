/**
 * Overnight HEAVY leftover after #241 — onGameEnd unknown id / null winner.
 * Distinct from wave52 tutorial unknown and wave40 draw/ai/player2. Tests-only.
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

describe('Wave 53 core owl — gameend unknown / null winner', () => {
  it('unknown gameId emits nothing and does not record stats', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onGameEnd('not-a-real-game-wave53', {
      winner: 'player1',
      moveCount: 3,
    });
    expect(types).toEqual([]);
    expect(storage.getGameStats('not-a-real-game-wave53').gamesPlayed).toBe(0);
    unsub();
  });

  it('winner null is a loss (not draw)', () => {
    const ends: Array<{ won: boolean; draw: boolean }> = [];
    owlSystem.onGameStart(knownGameId);
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        ends.push({ won: e.playerWon, draw: e.isDraw });
      }
    });
    owlSystem.onGameEnd(knownGameId, { winner: null, moveCount: 2 });
    expect(ends).toEqual([{ won: false, draw: false }]);
    expect(storage.getGameStats(knownGameId).gamesLost).toBe(1);
    expect(storage.getGameStats(knownGameId).gamesDraw).toBe(0);
    unsub();
  });
});
