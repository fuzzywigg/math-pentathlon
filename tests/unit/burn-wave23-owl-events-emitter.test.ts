/**
 * Wave 23 — OwlEventEmitter typed subscribe / wildcard / off / clear.
 * Pure in-memory; no DOM. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import { OwlEventEmitter, OwlEvent } from '../../src/core/owl';

function startEvent(overrides: Partial<Extract<OwlEvent, { type: 'game:start' }>> = {}): OwlEvent {
  return {
    type: 'game:start',
    timestamp: 1,
    gameId: 'hex',
    gameName: 'Hex',
    division: 'Division I',
    isFirstTime: true,
    timesPlayed: 0,
    ...overrides,
  };
}

describe('Wave 23 owl-events — OwlEventEmitter', () => {
  let emitter: OwlEventEmitter;

  beforeEach(() => {
    emitter = new OwlEventEmitter();
  });

  it('on specific type receives matching emits and unsubscribe stops', () => {
    const seen: string[] = [];
    const unsub = emitter.on('game:start', (e) => seen.push(e.type));

    emitter.emit(startEvent());
    emitter.emit({
      type: 'game:end',
      timestamp: 2,
      gameId: 'hex',
      gameName: 'Hex',
      playerWon: true,
      isDraw: false,
      duration: 10,
      moveCount: 1,
      winStreak: 1,
      isNewBestStreak: true,
    });
    expect(seen).toEqual(['game:start']);

    unsub();
    emitter.emit(startEvent({ timestamp: 3 }));
    expect(seen).toEqual(['game:start']);
  });

  it('wildcard * receives every event after specific handlers', () => {
    const order: string[] = [];
    emitter.on('game:start', () => order.push('specific'));
    emitter.on('*', (e) => order.push(`wild:${e.type}`));

    emitter.emit(startEvent());
    expect(order).toEqual(['specific', 'wild:game:start']);
  });

  it('off without handler clears all listeners for a type', () => {
    const hits: number[] = [];
    emitter.on('streak:update', () => hits.push(1));
    emitter.on('streak:update', () => hits.push(2));
    emitter.off('streak:update');
    emitter.emit({
      type: 'streak:update',
      timestamp: 1,
      currentStreak: 2,
      isNewRecord: false,
      previousBest: 5,
    });
    expect(hits).toEqual([]);
  });

  it('off with handler removes only that handler', () => {
    const a: string[] = [];
    const b: string[] = [];
    const ha = (e: OwlEvent) => a.push(e.type);
    const hb = (e: OwlEvent) => b.push(e.type);
    emitter.on('app:start', ha);
    emitter.on('app:start', hb);
    emitter.off('app:start', ha);
    emitter.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(a).toEqual([]);
    expect(b).toEqual(['app:start']);
  });

  it('clear removes specific and wildcard handlers', () => {
    const seen: string[] = [];
    emitter.on('tutorial:start', (e) => seen.push(e.type));
    emitter.on('*', (e) => seen.push(`*${e.type}`));
    emitter.clear();
    emitter.emit({
      type: 'tutorial:start',
      timestamp: 1,
      gameId: 'hex',
      gameName: 'Hex',
    });
    expect(seen).toEqual([]);
  });
});
