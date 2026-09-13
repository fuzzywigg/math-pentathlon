/**
 * Wave 23 — owlSystem lifecycle: show/hide/toggle, game/tutorial hooks, speakNow, settings gate.
 * Uses fake timers for queue / initialize delays. Distinct from owl-drag / drop-inspect UI.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  storage.updateSettings({ owlEnabled: true });
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  owlSystem.dismissMessage();
  owlSystem.hide();
  storage.resetAll();
  localStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 23 owl-system — visibility and state subscribers', () => {
  it('show / hide / toggle flip isVisible and notify subscribers', () => {
    const snapshots: boolean[] = [];
    const unsub = owlSystem.onStateChange((s) => snapshots.push(s.isVisible));

    // onStateChange immediately emits current (hidden)
    expect(snapshots[0]).toBe(false);

    owlSystem.show();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.hide();
    expect(owlSystem.getState().isVisible).toBe(false);
    expect(owlSystem.getState().message).toBeNull();

    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(false);

    unsub();
    owlSystem.show();
    // no further pushes after unsub beyond prior length
    const len = snapshots.length;
    owlSystem.hide();
    expect(snapshots.length).toBe(len);
  });

  it('dismissMessage clears bubble without forcing hide', () => {
    owlSystem.show();
    owlSystem.speakNow('peek', 'thinking');
    expect(owlSystem.getState().message?.text).toBe('peek');
    expect(owlSystem.getState().mood).toBe('thinking');

    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
    expect(owlSystem.getState().isVisible).toBe(true);
  });
});

describe('Wave 23 owl-system — game / tutorial hooks', () => {
  it('onGameStart no-ops for unknown game id', () => {
    const before = storage.getTotalGamesPlayed();
    owlSystem.onGameStart('not-a-real-game');
    expect(storage.getTotalGamesPlayed()).toBe(before);
  });

  it('onGameStart for hex emits via getEvents and leaves stats at zero until end', () => {
    const starts: string[] = [];
    const unsub = owlSystem.getEvents().on('game:start', (e) => {
      if (e.type === 'game:start') starts.push(e.gameId);
    });

    owlSystem.onGameStart('hex');
    expect(starts).toEqual(['hex']);
    expect(storage.getGameStats('hex').gamesPlayed).toBe(0);

    // Flush any queued message delays so afterEach is clean
    vi.runAllTimers();
    unsub();
  });

  it('onGameEnd records a win in storage and bumps streak', () => {
    owlSystem.onGameStart('hex');
    vi.advanceTimersByTime(500);

    owlSystem.onGameEnd('hex', { winner: 'player1', moveCount: 6 });
    vi.runAllTimers();

    const stats = storage.getGameStats('hex');
    expect(stats.gamesPlayed).toBe(1);
    expect(stats.gamesWon).toBe(1);
    expect(stats.currentWinStreak).toBe(1);
    expect(storage.getStreak().currentStreak).toBe(1);
  });

  it('onGameEnd draw records gamesDraw', () => {
    owlSystem.onGameStart('fiar');
    owlSystem.onGameEnd('fiar', { winner: 'draw', moveCount: 4 });
    vi.runAllTimers();
    expect(storage.getGameStats('fiar').gamesDraw).toBe(1);
    expect(storage.getGameStats('fiar').currentWinStreak).toBe(0);
  });

  it('onTutorialStart / Complete mark tutorial and stay no-op for unknown id', () => {
    owlSystem.onTutorialStart('missing-game');
    owlSystem.onTutorialComplete('missing-game');
    expect(storage.hasTutorialCompleted('missing-game')).toBe(false);

    owlSystem.onTutorialStart('hex');
    owlSystem.onTutorialComplete('hex');
    vi.runAllTimers();
    expect(storage.hasTutorialCompleted('hex')).toBe(true);
  });
});

describe('Wave 23 owl-system — settings gate and speakNow', () => {
  it('speakNow is ignored when owlEnabled is false', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.speakNow('should not appear', 'happy');
    expect(owlSystem.getState().message).toBeNull();
  });

  it('speakNow shows high-priority bubble then auto-clears after display time', async () => {
    owlSystem.speakNow('Inspect stub', 'thinking');
    expect(owlSystem.getState().isVisible).toBe(true);
    expect(owlSystem.getState().message?.text).toBe('Inspect stub');
    expect(owlSystem.getState().mood).toBe('thinking');

    await vi.runAllTimersAsync();
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('initialize with owl disabled returns without showing', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.initialize();
    vi.advanceTimersByTime(2000);
    expect(owlSystem.getState().isVisible).toBe(false);
  });

  it('initialize first visit schedules show after delay', () => {
    expect(storage.getProfile()).toBeNull();
    owlSystem.initialize();
    expect(owlSystem.getState().isVisible).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(owlSystem.getState().isVisible).toBe(true);
    vi.runAllTimers();
  });
});
