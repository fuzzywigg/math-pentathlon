/**
 * Overnight HEAVY leftover after #234 — onTutorialStart/Complete unknown gameId no-op.
 * Distinct from burn-wave23 onGameStart unknown + known tutorial emit. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 52 core owl — tutorial unknown game', () => {
  it('unknown id emits nothing and does not mark tutorial complete', () => {
    const types: string[] = [];
    const unsub = owlSystem.getEvents().on('*', (e) => types.push(e.type));
    const id = 'not-a-real-game-wave52';
    owlSystem.onTutorialStart(id);
    owlSystem.onTutorialComplete(id);
    expect(types).toEqual([]);
    expect(storage.hasTutorialCompleted(id)).toBe(false);
    unsub();
  });
});
