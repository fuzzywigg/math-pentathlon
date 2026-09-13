/**
 * Wave 23 — OwlEventEmitter on/emit/off/clear wildcard + typed handlers.
 * Distinct from owl-physics / drop-inspect shell tests and wave 22 toolkit UI.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  OwlEventEmitter,
  type OwlEvent,
  type GameStartEvent,
} from '../../src/core/owl';

afterEach(() => {
  vi.restoreAllMocks();
});

function gameStart(partial: Partial<GameStartEvent> = {}): GameStartEvent {
  return {
    type: 'game:start',
    timestamp: 1,
    gameId: 'hex',
    gameName: 'Hex',
    division: 'intermediate',
    isFirstTime: true,
    timesPlayed: 0,
    ...partial,
  };
}

describe('Wave 23 owl-events — emit routing', () => {
  it('specific handlers receive matching events only', () => {
    const emitter = new OwlEventEmitter();
    const starts: string[] = [];
    const ends: string[] = [];
    emitter.on('game:start', (e) => starts.push(e.type));
    emitter.on('game:end', (e) => ends.push(e.type));

    emitter.emit(gameStart());
    emitter.emit({
      type: 'game:end',
      timestamp: 2,
      gameId: 'hex',
      gameName: 'Hex',
      playerWon: true,
      isDraw: false,
      duration: 10,
      moveCount: 4,
      winStreak: 1,
      isNewBestStreak: true,
    });

    expect(starts).toEqual(['game:start']);
    expect(ends).toEqual(['game:end']);
  });

  it('wildcard handlers see every event alongside specific', () => {
    const emitter = new OwlEventEmitter();
    const all: OwlEvent['type'][] = [];
    const specific: OwlEvent['type'][] = [];
    emitter.on('*', (e) => all.push(e.type));
    emitter.on('streak:update', (e) => specific.push(e.type));

    emitter.emit({
      type: 'streak:update',
      timestamp: 1,
      currentStreak: 3,
      isNewRecord: false,
      previousBest: 5,
    });
    emitter.emit({
      type: 'milestone:reached',
      timestamp: 2,
      milestoneType: 'games_played',
      value: 10,
      description: '10 games',
    });

    expect(specific).toEqual(['streak:update']);
    expect(all).toEqual(['streak:update', 'milestone:reached']);
  });
});

describe('Wave 23 owl-events — unsubscribe / off / clear', () => {
  it('on() returns unsubscribe that removes only that handler', () => {
    const emitter = new OwlEventEmitter();
    const a: number[] = [];
    const b: number[] = [];
    const unsubA = emitter.on('app:start', () => a.push(1));
    emitter.on('app:start', () => b.push(1));

    emitter.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(a).toEqual([1]);
    expect(b).toEqual([1]);

    unsubA();
    emitter.emit({
      type: 'app:start',
      timestamp: 2,
      isFirstVisit: false,
      daysSinceLastVisit: 1,
    });
    expect(a).toEqual([1]);
    expect(b).toEqual([1, 1]);
  });

  it('off without handler clears type; off with handler filters', () => {
    const emitter = new OwlEventEmitter();
    const hits: string[] = [];
    const h1 = () => hits.push('h1');
    const h2 = () => hits.push('h2');
    emitter.on('tutorial:start', h1);
    emitter.on('tutorial:start', h2);
    emitter.off('tutorial:start', h1);
    emitter.emit({
      type: 'tutorial:start',
      timestamp: 1,
      gameId: 'fiar',
      gameName: 'FIAR',
    });
    expect(hits).toEqual(['h2']);

    emitter.off('tutorial:start');
    emitter.emit({
      type: 'tutorial:start',
      timestamp: 2,
      gameId: 'fiar',
      gameName: 'FIAR',
    });
    expect(hits).toEqual(['h2']);
  });

  it('clear removes all handlers including wildcard', () => {
    const emitter = new OwlEventEmitter();
    let n = 0;
    emitter.on('*', () => {
      n++;
    });
    emitter.on('achievement:unlock', () => {
      n++;
    });
    emitter.clear();
    emitter.emit({
      type: 'achievement:unlock',
      timestamp: 1,
      achievementId: 'a',
      achievementName: 'A',
      achievementDescription: 'desc',
    });
    expect(n).toBe(0);
  });
});
