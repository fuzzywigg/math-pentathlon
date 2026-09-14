/**
 * Overnight HEAVY leftover after #241 — 500ms pause between queued high messages.
 * Distinct from wave40 speakNow queue replace. Tests-only.
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
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 53 core owl — inter-message pause', () => {
  it('second tutorial:start waits 500ms after first bubble clears', async () => {
    owlSystem.onTutorialStart(knownGameId);
    owlSystem.onTutorialStart(knownGameId);
    await vi.advanceTimersByTimeAsync(20);
    const first = owlSystem.getState().message;
    expect(first).toBeTruthy();
    const firstId = first!.id;
    const displayMs =
      (5000 + Math.min(first!.text.length * 30, 3000)) * 1.5;

    await vi.advanceTimersByTimeAsync(displayMs);
    expect(owlSystem.getState().message).toBeNull();

    await vi.advanceTimersByTimeAsync(400);
    expect(owlSystem.getState().message).toBeNull();

    await vi.advanceTimersByTimeAsync(200);
    const second = owlSystem.getState().message;
    expect(second).toBeTruthy();
    expect(second!.priority).toBe('high');
    expect(second!.category).toBe('tutorial:start');
    expect(second!.id).not.toBe(firstId);
  });
});
