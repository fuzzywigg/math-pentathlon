/**
 * Wave 40 — owl game:end draw / ai winner leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage, type OwlMood } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  storage.updateSettings({ owlEnabled: true });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 40 owl-system — game end draw / ai', () => {
  it('draw winner emits isDraw and stamps thinking mood', () => {
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    const ends: Array<{ won: boolean; draw: boolean }> = [];
    owlSystem.onGameStart(knownGameId);
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        ends.push({ won: e.playerWon, draw: e.isDraw });
      }
    });

    owlSystem.onGameEnd(knownGameId, { winner: 'draw', moveCount: 12 });
    expect(ends).toEqual([{ won: false, draw: true }]);
    expect(moods).toContain('thinking');
    expect(storage.getGameStats(knownGameId).gamesDraw).toBe(1);
    unsub();
  });

  it('ai winner emits loss flags and stamps encouraging mood', () => {
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    const ends: Array<{ won: boolean; draw: boolean }> = [];
    owlSystem.onGameStart(knownGameId);
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        ends.push({ won: e.playerWon, draw: e.isDraw });
      }
    });

    owlSystem.onGameEnd(knownGameId, { winner: 'ai', moveCount: 9 });
    expect(ends).toEqual([{ won: false, draw: false }]);
    expect(moods).toContain('encouraging');
    expect(storage.getGameStats(knownGameId).gamesLost).toBe(1);
    unsub();
  });

  it('player2 winner is treated as a loss (not draw)', () => {
    const ends: Array<{ won: boolean; draw: boolean }> = [];
    owlSystem.onGameStart(knownGameId);
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        ends.push({ won: e.playerWon, draw: e.isDraw });
      }
    });
    owlSystem.onGameEnd(knownGameId, { winner: 'player2', moveCount: 4 });
    expect(ends).toEqual([{ won: false, draw: false }]);
    unsub();
  });
});
