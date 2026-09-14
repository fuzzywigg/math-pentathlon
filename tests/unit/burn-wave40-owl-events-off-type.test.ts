/**
 * Wave 40 — owl events off(type) without handler / empty emit leftovers.
 * Tests-only.
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
    division: 'Division I',
    isFirstTime: true,
    timesPlayed: 0,
    ...partial,
  };
}

describe('Wave 40 owl-events — off type + empty emit', () => {
  it('off(type) without handler removes all listeners for that type', () => {
    const emitter = new OwlEventEmitter();
    const hits: string[] = [];
    emitter.on('game:start', () => hits.push('a'));
    emitter.on('game:start', () => hits.push('b'));
    emitter.off('game:start');
    emitter.emit(gameStart());
    expect(hits).toEqual([]);
  });

  it('off(type) leaves other types and wildcard intact', () => {
    const emitter = new OwlEventEmitter();
    const hits: OwlEvent['type'][] = [];
    emitter.on('game:start', (e) => hits.push(e.type));
    emitter.on('game:end', (e) => hits.push(e.type));
    emitter.on('*', (e) => hits.push(e.type));

    emitter.off('game:start');
    emitter.emit(gameStart());
    // only wildcard fires for game:start
    expect(hits).toEqual(['game:start']);

    emitter.emit({
      type: 'game:end',
      timestamp: 2,
      gameId: 'hex',
      gameName: 'Hex',
      playerWon: false,
      isDraw: true,
      duration: 1,
      moveCount: 2,
      winStreak: 0,
      isNewBestStreak: false,
    });
    expect(hits).toEqual(['game:start', 'game:end', 'game:end']);
  });

  it('emit with no handlers is a quiet no-op', () => {
    const emitter = new OwlEventEmitter();
    expect(() => emitter.emit(gameStart())).not.toThrow();
  });

  it('off wildcard without handler clears * only', () => {
    const emitter = new OwlEventEmitter();
    let specific = 0;
    let wild = 0;
    emitter.on('app:start', () => {
      specific++;
    });
    emitter.on('*', () => {
      wild++;
    });
    emitter.off('*');
    emitter.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(specific).toBe(1);
    expect(wild).toBe(0);
  });
});
