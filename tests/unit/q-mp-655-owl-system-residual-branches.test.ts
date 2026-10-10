/**
 * q-mp-655 — Close `owl-system` residual branches (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1059`): with related `*owl-system*` suites,
 * lines **90.36%** / branches **77.31%** (75/97). Uncovered stmt clusters ~
 * 70–86, 203–217, 269–308, 344, 395, 410.
 *
 * Structural asserts only (ids, mood enums, event flags, queue/state conditions,
 * selectMessage context fields). No player-facing copy / aria / label / message
 * body pins. Zero `src/` edits. No AI move-choice/timing asserts.
 *
 * Open-PR check: no tip draft covered this; leave `#813`/`375` soft-fail + `382`
 * nullish clear alone (no comments/labels/closes per worker brief).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  owlSystem,
  owlMessages,
  type OwlMessage,
  type MessageContext,
} from '../../src/core/owl';
import { storage, type OwlMood } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';
const unknownGameId = 'not-a-real-game-q-mp-655';

type OwlSystemPrivate = {
  messageQueue: OwlMessage[];
  isProcessingQueue: boolean;
  speakEpoch: number;
  processQueue: () => Promise<void>;
};

function asPrivate(): OwlSystemPrivate {
  return owlSystem as unknown as OwlSystemPrivate;
}

function flushOwlChrome(): void {
  owlSystem.dismissMessage();
  owlSystem.hide();
  const priv = asPrivate();
  priv.messageQueue = [];
  priv.isProcessingQueue = false;
}

function captureMoods(): OwlMood[] {
  const moods: OwlMood[] = [];
  const orig = storage.updateOwlMood.bind(storage);
  vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
    moods.push(m);
    return orig(m);
  });
  return moods;
}

function stampLastActiveDaysAgo(days: number): void {
  const profile = storage.createProfile('Returner655', 'owl');
  storage.setProfile({
    ...profile,
    lastActiveAt: Date.now() - days * 24 * 60 * 60 * 1000,
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  flushOwlChrome();
  storage.updateSettings({ owlEnabled: true });
  // Drain leftover speakNow epoch/timer from shared isolate:false suite.
  owlSystem.speakNow('flush-q-mp-655', 'happy');
  flushOwlChrome();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  flushOwlChrome();
  // No hoisted vi.mock in this file — restoreAllMocks is safe and required so
  // updateOwlMood / getStreak / selectMessage spies cannot recurse across cases.
  vi.restoreAllMocks();
});

describe('q-mp-655 owl-system — initialize return / absence moods', () => {
  it('>7 days stamps sleepy then emits app:return', () => {
    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    stampLastActiveDaysAgo(8);
    const moods = captureMoods();
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));

    owlSystem.initialize();

    expect(types).toContain('app:return');
    expect(types).not.toContain('app:start');
    expect(moods[0]).toBe('sleepy');
    unsub();
  });

  it('>2 and ≤7 days stamps encouraging before app:return overwrite', () => {
    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    stampLastActiveDaysAgo(3);
    const moods = captureMoods();

    owlSystem.initialize();

    expect(moods[0]).toBe('encouraging');
  });

  it('lastActiveAt 0 is falsy → daysSinceLastVisit 0 on app:return', () => {
    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    const profile = storage.createProfile('ZeroActive655', 'owl');
    storage.setProfile({ ...profile, lastActiveAt: 0 });

    let days = -1;
    const unsub = owlSystem.getEvents().on('app:return', (e) => {
      if (e.type === 'app:return') days = e.daysSinceLastVisit;
    });
    owlSystem.initialize();

    expect(days).toBe(0);
    expect(storage.getProfile()?.lastActiveAt).toBe(Date.now());
    unsub();
  });
});

describe('q-mp-655 owl-system — getMoodForEvent residual arms', () => {
  it('app:return bus emit stamps happy', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'app:return',
      timestamp: 1,
      daysSinceLastVisit: 1,
      currentStreak: 2,
    });
    expect(moods).toContain('happy');
  });

  it('app:start isFirstVisit=false stamps encouraging', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: false,
      daysSinceLastVisit: 1,
    });
    expect(moods).toContain('encouraging');
  });

  it('achievement:unlock stamps celebrating', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'achievement:unlock',
      timestamp: 1,
      achievementId: 'q-mp-655-ach',
      achievementName: 'A',
      achievementDescription: 'd',
    });
    expect(moods).toContain('celebrating');
  });

  it('streak:update non-record stamps happy', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'streak:update',
      timestamp: 1,
      currentStreak: 3,
      isNewRecord: false,
      previousBest: 9,
    });
    expect(moods).toContain('happy');
  });

  it('game:end draw stamps thinking; ai loss stamps encouraging', () => {
    const moods = captureMoods();
    const ends: Array<{ won: boolean; draw: boolean }> = [];
    const unsub = owlSystem.getEvents().on('game:end', (e) => {
      if (e.type === 'game:end') {
        ends.push({ won: e.playerWon, draw: e.isDraw });
      }
    });

    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'draw', moveCount: 10 });
    expect(ends.at(-1)).toEqual({ won: false, draw: true });
    expect(moods).toContain('thinking');

    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'ai', moveCount: 8 });
    expect(ends.at(-1)).toEqual({ won: false, draw: false });
    expect(moods).toContain('encouraging');
    unsub();
  });
});

describe('q-mp-655 owl-system — unknown-id lifecycle soft-fail', () => {
  it('onGameEnd / onTutorialStart / onTutorialComplete unknown id emit nothing', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));

    owlSystem.onGameEnd(unknownGameId, { winner: 'player1', moveCount: 1 });
    owlSystem.onTutorialStart(unknownGameId);
    owlSystem.onTutorialComplete(unknownGameId);

    expect(types).toEqual([]);
    expect(storage.hasTutorialCompleted(unknownGameId)).toBe(false);
    unsub();
  });
});

describe('q-mp-655 owl-system — buildContext gameStats + timeOfDay', () => {
  it('game:start without prior stats omits gamesPlayedThisGame', () => {
    const contexts: MessageContext[] = [];
    const orig = owlMessages.selectMessage.bind(owlMessages);
    vi.spyOn(owlMessages, 'selectMessage').mockImplementation((type, ctx) => {
      contexts.push({ ...ctx });
      return orig(type, ctx);
    });

    owlSystem.getEvents().emit({
      type: 'game:start',
      timestamp: Date.now(),
      gameId: 'never-recorded-q-mp-655',
      gameName: 'Never',
      division: 'I',
      isFirstTime: true,
      timesPlayed: 0,
    });

    expect(contexts.length).toBeGreaterThan(0);
    expect(contexts[0]?.gameId).toBe('never-recorded-q-mp-655');
    expect(contexts[0]?.gamesPlayedThisGame).toBeUndefined();
    expect(contexts[0]?.winStreak).toBeUndefined();
  });

  it('game:start after recorded stats attaches gamesPlayedThisGame', () => {
    storage.recordGameResult({
      gameId: knownGameId,
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 4,
      playedAt: Date.now(),
    });

    const contexts: MessageContext[] = [];
    const orig = owlMessages.selectMessage.bind(owlMessages);
    vi.spyOn(owlMessages, 'selectMessage').mockImplementation((type, ctx) => {
      contexts.push({ ...ctx });
      return orig(type, ctx);
    });

    owlSystem.onGameStart(knownGameId);

    expect(contexts.length).toBeGreaterThan(0);
    expect(contexts[0]?.gameId).toBe(knownGameId);
    expect(typeof contexts[0]?.gamesPlayedThisGame).toBe('number');
    expect(contexts[0]!.gamesPlayedThisGame!).toBeGreaterThanOrEqual(1);
  });

  it.each([
    { hour: 6, tod: 'morning' as const },
    { hour: 13, tod: 'afternoon' as const },
    { hour: 18, tod: 'evening' as const },
    { hour: 22, tod: 'night' as const },
  ])('local hour $hour builds timeOfDay=$tod', ({ hour, tod }) => {
    vi.setSystemTime(new Date(2026, 9, 10, hour, 0, 0));
    const contexts: MessageContext[] = [];
    const orig = owlMessages.selectMessage.bind(owlMessages);
    vi.spyOn(owlMessages, 'selectMessage').mockImplementation((type, ctx) => {
      contexts.push({ ...ctx });
      return orig(type, ctx);
    });

    owlSystem.getEvents().emit({
      type: 'streak:broken',
      timestamp: Date.now(),
      previousStreak: 1,
      daysMissed: 1,
    });

    expect(contexts[0]?.timeOfDay).toBe(tod);
  });
});

describe('q-mp-655 owl-system — processQueue clear + inter-message pause', () => {
  it('normal drain clears bubble then pauses 500ms before next high message', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    owlSystem.onTutorialStart(knownGameId);
    owlSystem.onTutorialStart(knownGameId);
    await vi.advanceTimersByTimeAsync(20);

    const first = owlSystem.getState().message;
    expect(first).toBeTruthy();
    expect(first!.priority).toBe('high');
    expect(first!.category).toBe('tutorial:start');
    const firstId = first!.id;
    const displayMs =
      (5000 + Math.min(first!.text.length * 30, 3000)) * 1.5;

    await vi.advanceTimersByTimeAsync(displayMs);
    // L268–269: epoch still matches → clear bubble after display.
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);

    await vi.advanceTimersByTimeAsync(400);
    expect(owlSystem.getState().message).toBeNull();

    // L273–274: 500ms pause then next queued high line surfaces.
    await vi.advanceTimersByTimeAsync(200);
    const second = owlSystem.getState().message;
    expect(second).toBeTruthy();
    expect(second!.priority).toBe('high');
    expect(second!.category).toBe('tutorial:start');
    expect(second!.id).not.toBe(firstId);
  });
});

describe('q-mp-655 owl-system — streak:update gate when currentStreak is 0', () => {
  it('onGameEnd skips streak:update when storage streak is 0', () => {
    const streaks: string[] = [];
    const unsub = owlSystem.getEvents().on('streak:update', (e) => {
      streaks.push(e.type);
    });

    vi.spyOn(storage, 'getStreak').mockReturnValue({
      currentStreak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      streakStartDate: '',
    });

    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 2 });

    expect(streaks).toEqual([]);
    unsub();
  });
});
