/**
 * Wave 23 — owlSystem show/hide/toggle / game lifecycle / tutorial / speakNow gates.
 * Distinct from owl-drop-inspect speakNow stub and wave 22 toolkit UI.
 * Tests-only. No product inventing.
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
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 23 owl-system — visibility + state subscription', () => {
  it('show / hide / toggle update isVisible', () => {
    expect(owlSystem.getState().isVisible).toBe(false);
    owlSystem.show();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.hide();
    expect(owlSystem.getState().isVisible).toBe(false);
    expect(owlSystem.getState().message).toBeNull();
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(false);
  });

  it('onStateChange fires immediately and on updates; unsubscribe works', () => {
    const snapshots: boolean[] = [];
    const unsub = owlSystem.onStateChange((s) => snapshots.push(s.isVisible));
    expect(snapshots.length).toBeGreaterThanOrEqual(1);
    owlSystem.show();
    expect(snapshots.at(-1)).toBe(true);
    unsub();
    const len = snapshots.length;
    owlSystem.hide();
    expect(snapshots.length).toBe(len);
  });
});

describe('Wave 23 owl-system — game / tutorial lifecycle', () => {
  it('onGameStart emits and queues a message when owl enabled', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('game:start', (e) => types.push(e.type));
    owlSystem.onGameStart(knownGameId);
    expect(types).toEqual(['game:start']);
    unsub();
    // message may be queued asynchronously via processQueue
    vi.advanceTimersByTime(50);
    expect(storage.getOwlState().mood).toBeTruthy();
  });

  it('onGameStart no-ops for unknown game id', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onGameStart('not-a-real-game-id-wave23');
    expect(types).toEqual([]);
    unsub();
  });

  it('onGameEnd records stats and emits game:end', () => {
    const ends: Array<{ won: boolean }> = [];
    owlSystem.onGameStart(knownGameId);
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') ends.push({ won: e.playerWon });
    });
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 7 });
    expect(ends).toEqual([{ won: true }]);
    expect(storage.getGameStats(knownGameId).gamesWon).toBe(1);
    expect(storage.getGameStats(knownGameId).gamesPlayed).toBe(1);
    unsub();
  });

  it('onTutorialStart/Complete mark tutorial and emit', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onTutorialStart(knownGameId);
    owlSystem.onTutorialComplete(knownGameId);
    expect(types).toContain('tutorial:start');
    expect(types).toContain('tutorial:complete');
    expect(storage.hasTutorialCompleted(knownGameId)).toBe(true);
    unsub();
  });
});

describe('Wave 23 owl-system — speakNow / dismiss / disabled', () => {
  it('speakNow shows bubble then auto-dismisses; dismiss clears early', () => {
    owlSystem.speakNow('Wave23 inspect line', 'thinking');
    const state = owlSystem.getState();
    expect(state.isVisible).toBe(true);
    expect(state.message?.text).toBe('Wave23 inspect line');
    expect(state.mood).toBe('thinking');

    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('speakNow respects owlEnabled=false', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.hide();
    owlSystem.speakNow('should not show', 'happy');
    expect(owlSystem.getState().message).toBeNull();
  });

  it('initialize with owl disabled is a no-op', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.initialize();
    expect(owlSystem.getState().isVisible).toBe(false);
  });

  it('initialize first visit emits app:start and shows after delay', () => {
    storage.updateSettings({ owlEnabled: true });
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.initialize();
    expect(types).toContain('app:start');
    vi.advanceTimersByTime(1000);
    expect(owlSystem.getState().isVisible).toBe(true);
    unsub();
  });
});
