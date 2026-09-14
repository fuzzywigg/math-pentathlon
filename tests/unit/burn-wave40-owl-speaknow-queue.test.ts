/**
 * Wave 40 — owl speakNow clears queue / bubble leftovers.
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

describe('Wave 40 owl-system — speakNow queue', () => {
  it('speakNow replaces queued game message with inspect bubble', async () => {
    owlSystem.onGameStart(knownGameId);
    // Let processQueue pick up the game:start message
    await vi.advanceTimersByTimeAsync(50);
    const queued = owlSystem.getState().message;
    expect(queued).toBeTruthy();

    owlSystem.speakNow('Inspect override wave40', 'thinking');
    const state = owlSystem.getState();
    expect(state.isVisible).toBe(true);
    expect(state.message?.text).toBe('Inspect override wave40');
    expect(state.message?.priority).toBe('high');
    expect(state.mood).toBe('thinking');
    expect(state.message?.id).toMatch(/^ollie-inspect-stub-/);
  });

  it('speakNow auto-dismisses after display time with fake timers', async () => {
    owlSystem.speakNow('Short dismiss', 'happy');
    expect(owlSystem.getState().message?.text).toBe('Short dismiss');

    // base 5000 + lengthBonus + priority 1.5 — advance generously
    await vi.advanceTimersByTimeAsync(30_000);
    expect(owlSystem.getState().message).toBeNull();
    expect(owlSystem.getState().isAnimating).toBe(false);
  });

  it('second speakNow invalidates prior dismiss timer', async () => {
    owlSystem.speakNow('First line', 'thinking');
    await vi.advanceTimersByTimeAsync(1000);
    owlSystem.speakNow('Second line', 'proud');
    expect(owlSystem.getState().message?.text).toBe('Second line');
    expect(owlSystem.getState().mood).toBe('proud');

    // First timer would have fired by now relative to first speak — must keep second
    await vi.advanceTimersByTimeAsync(4000);
    expect(owlSystem.getState().message?.text).toBe('Second line');

    await vi.advanceTimersByTimeAsync(30_000);
    expect(owlSystem.getState().message).toBeNull();
  });
});
