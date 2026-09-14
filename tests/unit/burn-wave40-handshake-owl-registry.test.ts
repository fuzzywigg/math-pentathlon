/**
 * Wave 40 — handshake owl onGameStart uses live GAMES registry leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { GAMES, getGameById } from '../../src/core/game-registry';
import type { GameStartEvent } from '../../src/core/owl';

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

describe('Wave 40 handshake — owl registry', () => {
  it('onGameStart emits live name and division from GAMES', () => {
    const available = GAMES.filter((g) => g.available);
    expect(available.length).toBeGreaterThan(0);

    for (const game of available.slice(0, 5)) {
      let captured: GameStartEvent | null = null;
      const unsub = owlSystem.getEvents().on('game:start', (e) => {
        if (e.type === 'game:start') captured = e;
      });

      owlSystem.onGameStart(game.id);
      expect(captured).toBeTruthy();
      expect(captured!.gameId).toBe(game.id);
      expect(captured!.gameName).toBe(game.name);
      expect(captured!.division).toBe(game.division);
      expect(captured!.gameName).toBe(getGameById(game.id)!.name);
      unsub();
    }
  });

  it('isFirstTime / timesPlayed track storage gamesPlayed', () => {
    const game = GAMES.find((g) => g.available)!;
    const starts: Array<{ first: boolean; times: number }> = [];
    const unsub = owlSystem.getEvents().on('game:start', (e) => {
      if (e.type === 'game:start') {
        starts.push({ first: e.isFirstTime, times: e.timesPlayed });
      }
    });

    owlSystem.onGameStart(game.id);
    expect(starts[0]).toEqual({ first: true, times: 0 });

    owlSystem.onGameEnd(game.id, { winner: 'player1', moveCount: 5 });
    owlSystem.onGameStart(game.id);
    expect(starts[1]).toEqual({ first: false, times: 1 });
    unsub();
  });

  it('unknown id does not emit and does not invent a gameName', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onGameStart('not-in-registry-wave40');
    expect(types).toEqual([]);
    expect(getGameById('not-in-registry-wave40')).toBeUndefined();
    unsub();
  });
});
