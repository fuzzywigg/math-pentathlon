/**
 * Wave 40 — owlEnabled=false still emits events but no message leftovers.
 * Tests-only.
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
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 40 owl-system — owlEnabled false', () => {
  it('onGameStart emits event but does not queue a message', async () => {
    storage.updateSettings({ owlEnabled: false });
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));

    owlSystem.onGameStart(knownGameId);
    expect(types).toContain('game:start');
    await vi.advanceTimersByTimeAsync(100);
    expect(owlSystem.getState().message).toBeNull();
    unsub();
  });

  it('onGameEnd emits and records stats without a speech bubble', async () => {
    storage.updateSettings({ owlEnabled: false });
    const ends: string[] = [];
    const unsub = owlSystem.getEvents().on('game:end', (e) => ends.push(e.type));

    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 3 });
    expect(ends).toEqual(['game:end']);
    expect(storage.getGameStats(knownGameId).gamesPlayed).toBe(1);
    await vi.advanceTimersByTimeAsync(100);
    expect(owlSystem.getState().message).toBeNull();
    unsub();
  });

  it('speakNow is a hard no-op when disabled', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.speakNow('should not appear', 'celebrating');
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('re-enabling allows messages again', async () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.onGameStart(knownGameId);
    await vi.advanceTimersByTimeAsync(50);
    expect(owlSystem.getState().message).toBeNull();

    storage.updateSettings({ owlEnabled: true });
    owlSystem.onGameStart(knownGameId);
    await vi.advanceTimersByTimeAsync(50);
    expect(owlSystem.getState().message).toBeTruthy();
  });
});
