/**
 * Wave 39 — isValidSetGameSet → storage unlock/record handshake.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { isValidSetGameSet } from '../../src/core/attributes/logic';
import {
  SET_GAME_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 39 handshake — SET → storage', () => {
  it('valid SET unlocks achievement and records win', () => {
    const triple = [
      createPiece('a', {
        number: 1,
        color: 'red',
        shading: 'solid',
        shape: 'oval',
      }),
      createPiece('b', {
        number: 2,
        color: 'green',
        shading: 'solid',
        shape: 'oval',
      }),
      createPiece('c', {
        number: 3,
        color: 'purple',
        shading: 'solid',
        shape: 'oval',
      }),
    ];
    expect(isValidSetGameSet(triple, SET_GAME_ATTRIBUTES)).toBe(true);
    storage.recordGameResult({
      gameId: 'attribute-demo',
      winner: 'player',
      playerWon: true,
      duration: 1500,
      moveCount: 3,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('set-first-valid');
    expect(storage.hasAchievement('set-first-valid')).toBe(true);
    expect(storage.getGameStats('attribute-demo').gamesWon).toBe(1);
  });

  it('invalid triple length records loss without draw', () => {
    expect(
      isValidSetGameSet(
        [
          createPiece('a', {
            number: 1,
            color: 'red',
            shading: 'solid',
            shape: 'oval',
          }),
        ],
        SET_GAME_ATTRIBUTES
      )
    ).toBe(false);
    storage.recordGameResult({
      gameId: 'attribute-demo',
      winner: null,
      playerWon: false,
      duration: 100,
      moveCount: 1,
      playedAt: Date.now(),
    });
    const stats = storage.getGameStats('attribute-demo');
    expect(stats.gamesLost).toBe(1);
    expect(stats.gamesDraw).toBe(0);
  });
});
