/**
 * Overnight HEAVY leftover after #241 — getMoodForEvent via live bus emit.
 * Distinct from wave40 game-end draw/ai and wave52 tutorial unknown. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage, type OwlMood } from '../../src/core/storage';

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

function captureMoods(): OwlMood[] {
  const moods: OwlMood[] = [];
  const orig = storage.updateOwlMood.bind(storage);
  vi.spyOn(storage, 'updateOwlMood').mockImplementation((m) => {
    moods.push(m);
    return orig(m);
  });
  return moods;
}

describe('Wave 53 core owl — mood emit matrix', () => {
  it('achievement:unlock stamps celebrating', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'achievement:unlock',
      timestamp: 1,
      achievementId: 'a',
      achievementName: 'A',
      achievementDescription: 'd',
    });
    expect(moods).toContain('celebrating');
  });

  it('streak:update new record is proud; otherwise happy', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'streak:update',
      timestamp: 1,
      currentStreak: 3,
      isNewRecord: true,
      previousBest: 2,
    });
    owlSystem.getEvents().emit({
      type: 'streak:update',
      timestamp: 2,
      currentStreak: 3,
      isNewRecord: false,
      previousBest: 9,
    });
    expect(moods).toContain('proud');
    expect(moods).toContain('happy');
  });

  it('streak:broken stamps encouraging; milestone default happy', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'streak:broken',
      timestamp: 1,
      previousStreak: 4,
      daysMissed: 2,
    });
    owlSystem.getEvents().emit({
      type: 'milestone:reached',
      timestamp: 2,
      milestoneType: 'games_played',
      value: 10,
      description: '10',
    });
    expect(moods).toContain('encouraging');
    expect(moods).toContain('happy');
  });

  it('app:start returning visit (isFirstVisit false) stamps encouraging', () => {
    const moods = captureMoods();
    owlSystem.getEvents().emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: false,
      daysSinceLastVisit: 1,
    });
    expect(moods).toContain('encouraging');
  });
});
