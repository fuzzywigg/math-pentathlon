/**
 * Wave 41 — Storage setProfile overwrite + default helper isolation.
 * Avoids PR182 division/owl-message. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  storage,
  createDefaultProgress,
  createDefaultGameStats,
} from '../../src/core/storage';

describe('Wave 41 storage — profile / defaults', () => {
  beforeEach(() => {
    storage.resetAll();
  });

  it('setProfile overwrite keeps stats intact', () => {
    storage.createProfile('Alice', '🦊');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 3,
      playedAt: Date.now(),
    });
    const before = storage.getTotalGamesPlayed();
    storage.setProfile({
      ...storage.getProfile()!,
      name: 'Bob',
      avatar: '🦉',
    });
    expect(storage.getProfile()?.name).toBe('Bob');
    expect(storage.getTotalGamesPlayed()).toBe(before);
  });

  it('createDefaultGameStats zeros with matching timestamps', () => {
    const stats = createDefaultGameStats('demo-game');
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.gamesWon).toBe(0);
    expect(stats.firstPlayed).toBe(stats.lastPlayed);
  });

  it('createDefaultProgress isolates owl messagesSeen arrays', () => {
    const a = createDefaultProgress();
    const b = createDefaultProgress();
    a.owlState.messagesSeen.push('x');
    expect(b.owlState.messagesSeen).not.toContain('x');
    expect(a).not.toBe(b);
  });
});
