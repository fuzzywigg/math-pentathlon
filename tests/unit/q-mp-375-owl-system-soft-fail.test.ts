/**
 * q-mp-375 — Characterize owl-system soft-fail / inspect / subscription edges.
 *
 * Tests only. Structural asserts on visibility, mood enums, message id/category/
 * priority, and queue/epoch soft-fail gates. No player-facing copy pins, no src
 * edits, no AI path.
 *
 * Narrowed vs open drafts: #813 owns owl UI branch coverage; overnight/burn
 * waves cover happy-path lifecycle + mood matrix — this file targets the
 * residual soft-fail matrix (disabled-event ignore, processQueue re-entry,
 * speakNow mid-queue epoch break, seen non-high skip, inspect timer supersede,
 * getState copy).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem, owlMessages, type OwlMessage } from '../../src/core/owl';
import { storage, type OwlMood } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';

type OwlSystemPrivate = {
  messageQueue: OwlMessage[];
  isProcessingQueue: boolean;
  speakEpoch: number;
  processQueue: () => Promise<void>;
  currentState: { message: OwlMessage | null; isAnimating: boolean };
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

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  flushOwlChrome();
  storage.updateSettings({ owlEnabled: true });
  // Drain any leftover speakNow epoch/timer from shared isolate:false suite.
  owlSystem.speakNow('flush-q-mp-375', 'happy');
  flushOwlChrome();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  flushOwlChrome();
  // Targeted only — restoreAllMocks tears down hoisted vi.mock on unit-shared.
  vi.clearAllMocks();
});

describe('q-mp-375 owl-system — disabled-event soft-fail', () => {
  it('bus emits while owlEnabled=false leave mood/message untouched', () => {
    storage.updateSettings({ owlEnabled: false });
    const moods: OwlMood[] = [];
    const orig = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return orig(m);
    });

    owlSystem.getEvents().emit({
      type: 'achievement:unlock',
      timestamp: 1,
      achievementId: 'soft-fail-disabled',
      achievementName: 'Soft',
      achievementDescription: 'fail',
    });

    expect(moods).toEqual([]);
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('lifecycle helpers no-op on the bus when owl is disabled mid-session', () => {
    storage.updateSettings({ owlEnabled: false });
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));

    // Unknown-id soft-fail still short-circuits before emit.
    owlSystem.onGameStart('not-a-real-game-q-mp-375');
    expect(types).toEqual([]);

    // Known id still emits (public API), but handleEvent ignores while disabled.
    owlSystem.onGameStart(knownGameId);
    expect(types).toContain('game:start');
    expect(owlSystem.getState().message).toBeNull();
    unsub();
  });
});

describe('q-mp-375 owl-system — processQueue soft-fail / re-entry', () => {
  it('empty queue processQueue is a no-op and leaves isProcessingQueue false', async () => {
    const priv = asPrivate();
    expect(priv.messageQueue).toEqual([]);
    expect(priv.isProcessingQueue).toBe(false);
    await priv.processQueue();
    expect(priv.isProcessingQueue).toBe(false);
    expect(owlSystem.getState().message).toBeNull();
  });

  it('re-entrant processQueue returns while a drain is already in flight', async () => {
    const priv = asPrivate();
    priv.isProcessingQueue = true;
    priv.messageQueue.push({
      id: 'q-mp-375-reentry-queued',
      text: 'should-not-surface-while-locked',
      category: 'game:start',
      priority: 'normal',
    });
    await priv.processQueue();
    // Soft-fail: early return leaves the pending item queued and unsurfaced.
    expect(priv.messageQueue).toHaveLength(1);
    expect(owlSystem.getState().message).toBeNull();
    priv.messageQueue = [];
    priv.isProcessingQueue = false;
  });

  it('seen non-high queued lines are skipped without surfacing a bubble', async () => {
    const priv = asPrivate();
    const seenId = 'q-mp-375-seen-normal';
    storage.markMessageSeen(seenId);
    priv.messageQueue.push({
      id: seenId,
      text: 'seen-normal-skip',
      category: 'game:start',
      priority: 'normal',
    });
    const drain = priv.processQueue();
    await vi.advanceTimersByTimeAsync(50);
    await drain;
    expect(owlSystem.getState().message).toBeNull();
    expect(priv.messageQueue).toEqual([]);
    expect(priv.isProcessingQueue).toBe(false);
  });
});

describe('q-mp-375 owl-system — speakNow inspect / epoch soft-fail', () => {
  it('speakNow mid-display clears queue and survives the old processQueue timer', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    owlSystem.onTutorialStart(knownGameId);
    await vi.advanceTimersByTimeAsync(20);
    const queued = owlSystem.getState().message;
    expect(queued).toBeTruthy();
    expect(queued!.priority).toBe('high');
    expect(queued!.category).toBe('tutorial:start');

    const libraryDisplayMs =
      (5000 + Math.min(queued!.text.length * 30, 3000)) * 1.5;
    const epochBefore = asPrivate().speakEpoch;
    owlSystem.speakNow('q-mp-375 inspect interrupt', 'thinking');
    expect(asPrivate().speakEpoch).toBe(epochBefore + 1);
    expect(asPrivate().messageQueue).toEqual([]);

    const inspect = owlSystem.getState();
    expect(inspect.isVisible).toBe(true);
    expect(inspect.mood).toBe('thinking');
    expect(inspect.message?.category).toBe('game:move');
    expect(inspect.message?.priority).toBe('high');
    expect(inspect.message?.id).toMatch(/^ollie-inspect-stub-/);
    // Structural: inspect text is caller-owned, not MESSAGE_LIBRARY.
    expect(inspect.message?.text).toBe('q-mp-375 inspect interrupt');
    expect(inspect.message?.id).not.toBe(queued!.id);
    const inspectId = inspect.message!.id;
    const inspectDisplayMs =
      (5000 + Math.min(inspect.message!.text.length * 30, 3000)) * 1.5;

    // Finish the in-flight library delay without past the inspect timer.
    const advanceToLibraryEnd = Math.min(
      libraryDisplayMs + 50,
      inspectDisplayMs - 200
    );
    expect(advanceToLibraryEnd).toBeGreaterThan(0);
    await vi.advanceTimersByTimeAsync(advanceToLibraryEnd);
    expect(owlSystem.getState().message?.id).toBe(inspectId);
    expect(asPrivate().isProcessingQueue).toBe(false);
  });

  it('epoch bump mid-queue breaks drain without surfacing remaining lines', async () => {
    const priv = asPrivate();
    const first: OwlMessage = {
      id: 'q-mp-375-epoch-first',
      text: 'epoch-first',
      category: 'tutorial:start',
      priority: 'high',
    };
    const second: OwlMessage = {
      id: 'q-mp-375-epoch-second',
      text: 'epoch-second',
      category: 'tutorial:start',
      priority: 'high',
    };
    priv.messageQueue.push(first, second);
    const drain = priv.processQueue();
    await vi.advanceTimersByTimeAsync(20);
    expect(owlSystem.getState().message?.id).toBe(first.id);

    // Defensive soft-fail residual: epoch advances while items remain queued.
    priv.speakEpoch += 1;
    const firstDisplayMs =
      (5000 + Math.min(first.text.length * 30, 3000)) * 1.5;
    await vi.advanceTimersByTimeAsync(firstDisplayMs + 600);
    await drain;

    expect(owlSystem.getState().message?.id).toBe(first.id);
    expect(priv.messageQueue.map((m) => m.id)).toEqual([second.id]);
    expect(priv.isProcessingQueue).toBe(false);
    priv.messageQueue = [];
  });

  it('second speakNow supersedes first auto-dismiss timer', async () => {
    owlSystem.speakNow('q-mp-375 first inspect', 'happy');
    const firstId = owlSystem.getState().message?.id;
    expect(firstId).toMatch(/^ollie-inspect-stub-/);

    await vi.advanceTimersByTimeAsync(100);
    owlSystem.speakNow('q-mp-375 second inspect', 'proud');
    const secondId = owlSystem.getState().message?.id;
    expect(secondId).toMatch(/^ollie-inspect-stub-/);
    expect(secondId).not.toBe(firstId);
    expect(owlSystem.getState().mood).toBe('proud');
    expect(owlSystem.getState().message?.text).toBe('q-mp-375 second inspect');

    // First timer would have fired by now for short copy; second must remain.
    await vi.advanceTimersByTimeAsync(5000);
    expect(owlSystem.getState().message?.id).toBe(secondId);

    // Second inspect still auto-dismisses on its own timer.
    await vi.advanceTimersByTimeAsync(20_000);
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('dismiss mid-inspect prevents speakNow timer from re-showing the bubble', async () => {
    owlSystem.speakNow('q-mp-375 dismiss race', 'thinking');
    const id = owlSystem.getState().message?.id;
    expect(id).toMatch(/^ollie-inspect-stub-/);
    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();

    await vi.advanceTimersByTimeAsync(30_000);
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });
});

describe('q-mp-375 owl-system — subscription / context soft edges', () => {
  it('getState returns a shallow copy (mutating snapshot does not stick)', () => {
    owlSystem.show();
    const snap = owlSystem.getState();
    expect(snap.isVisible).toBe(true);
    snap.isVisible = false;
    snap.mood = 'sleepy';
    expect(owlSystem.getState().isVisible).toBe(true);
    expect(owlSystem.getState().mood).not.toBe('sleepy');
  });

  it('nameless profile still builds a non-empty playerName for message select', () => {
    const profile = storage.createProfile('', 'owl');
    storage.setProfile({ ...profile, name: '' });

    const contexts: Array<{ playerName?: string }> = [];
    const orig = owlMessages.selectMessage.bind(owlMessages);
    vi.spyOn(owlMessages, 'selectMessage').mockImplementation((type, ctx) => {
      contexts.push({ playerName: ctx.playerName });
      return orig(type, ctx);
    });

    owlSystem.getEvents().emit({
      type: 'streak:broken',
      timestamp: Date.now(),
      previousStreak: 1,
      daysMissed: 1,
    });

    expect(contexts.length).toBeGreaterThan(0);
    expect(typeof contexts[0]?.playerName).toBe('string');
    expect((contexts[0]?.playerName ?? '').length).toBeGreaterThan(0);
  });

  it('selectMessage null soft-fail does not enqueue or stamp mood', () => {
    const moods: OwlMood[] = [];
    const origMood = storage.updateOwlMood.bind(storage);
    vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
      moods.push(m);
      return origMood(m);
    });
    vi.spyOn(owlMessages, 'selectMessage').mockReturnValue(null);

    owlSystem.getEvents().emit({
      type: 'milestone:reached',
      timestamp: 1,
      milestoneType: 'games_played',
      value: 1,
      description: '1',
    });

    expect(moods).toEqual([]);
    expect(asPrivate().messageQueue).toEqual([]);
    expect(owlSystem.getState().message).toBeNull();
  });
});
