/**
 * Wave 42 — owl tutorial start/complete lifecycle leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const gameId = GAMES.find((g) => g.available)?.id ?? 'hex';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  storage.updateSettings({ owlEnabled: true });
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

describe('Wave 42 owl-system — tutorial lifecycle', () => {
  it('onTutorialStart emits tutorial:start', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onTutorialStart(gameId);
    expect(types).toContain('tutorial:start');
    unsub();
  });

  it('onTutorialComplete marks storage and emits complete', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    expect(storage.isTutorialCompleted(gameId)).toBe(false);
    owlSystem.onTutorialComplete(gameId);
    expect(storage.isTutorialCompleted(gameId)).toBe(true);
    expect(types).toContain('tutorial:complete');
    unsub();
  });

  it('unknown game id is a no-op for tutorial start', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    owlSystem.onTutorialStart('___no-such-game___');
    expect(types).not.toContain('tutorial:start');
    unsub();
  });

  it('tutorial start queues a message when enabled', async () => {
    owlSystem.onTutorialStart(gameId);
    await vi.advanceTimersByTimeAsync(50);
    expect(owlSystem.getState().message).toBeTruthy();
  });

  it('tutorial complete is idempotent in storage', () => {
    owlSystem.onTutorialComplete(gameId);
    owlSystem.onTutorialComplete(gameId);
    expect(storage.isTutorialCompleted(gameId)).toBe(true);
  });
});
