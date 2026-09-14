/**
 * Overnight HEAVY leftover after #241 — processQueue skips seen non-high messages.
 * Distinct from wave52 selectMessage all-seen fallback (still returns a pick).
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem, owlMessages } from '../../src/core/owl';
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
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 53 core owl — queue skip seen normal', () => {
  it('seen generic game:start lines never surface as a bubble', async () => {
    owlSystem.onGameStart(knownGameId);
    owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 2 });
    await vi.advanceTimersByTimeAsync(50);
    owlSystem.dismissMessage();

    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      storage.markMessageSeen(m.id);
    }

    owlSystem.onGameStart(knownGameId);
    await vi.advanceTimersByTimeAsync(200);
    expect(owlSystem.getState().message).toBeNull();
  });

  it('seen high-priority tutorial:start still surfaces (skip gate is non-high)', async () => {
    for (const m of owlMessages.getMessagesByCategory('tutorial:start')) {
      storage.markMessageSeen(m.id);
    }
    owlSystem.onTutorialStart(knownGameId);
    await vi.advanceTimersByTimeAsync(50);
    expect(owlSystem.getState().message).toBeTruthy();
    expect(owlSystem.getState().message?.priority).toBe('high');
  });
});
