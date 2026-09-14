/**
 * Overnight HEAVY leftover after #256 — buildContext defaults playerName to
 * Mathematician when profile name is empty. Distinct from wave40 friend placeholder.
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
  owlSystem.speakNow('flush-wave56', 'happy');
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

describe('Wave 56 core owl — Mathematician default name', () => {
  it('empty profile name formats game:start as Mathematician', async () => {
    const profile = storage.createProfile('tmp', 'owl');
    storage.setProfile({ ...profile, name: '' });
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      storage.markMessageSeen(m.id);
    }
    owlMessages.addMessage({
      id: 'w56-math-name',
      category: 'game:start',
      priority: 'high',
      text: 'Hello {playerName}!',
    });
    owlSystem.onGameStart(knownGameId);
    await vi.advanceTimersByTimeAsync(50);
    expect(owlSystem.getState().message?.text).toBe('Hello Mathematician!');
  });
});
