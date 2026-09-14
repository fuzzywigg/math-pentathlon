/**
 * Wave 38 — OwlEventEmitter on/off/emit matrix leftovers.
 * Beyond wave 23 system lifecycle. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';

import {
  OwlEventEmitter,
  type OwlEvent,
  type GameStartEvent,
  type StreakBrokenEvent,
  type MilestoneEvent,
} from '../../src/core/owl/owl-events';

function gameStart(partial: Partial<GameStartEvent> = {}): GameStartEvent {
  return {
    type: 'game:start',
    timestamp: 1,
    gameId: 'hex',
    gameName: 'Hex',
    division: 'I',
    isFirstTime: true,
    timesPlayed: 0,
    ...partial,
  };
}

describe('Wave 38 owl-events — subscription matrix', () => {
  it('typed handler receives only matching events; star receives all', () => {
    const bus = new OwlEventEmitter();
    const starts: OwlEvent[] = [];
    const all: OwlEvent[] = [];
    const offStart = bus.on('game:start', (e) => starts.push(e));
    const offAll = bus.on('*', (e) => all.push(e));

    bus.emit(gameStart());
    const broken: StreakBrokenEvent = {
      type: 'streak:broken',
      timestamp: 2,
      previousStreak: 4,
      daysMissed: 2,
    };
    bus.emit(broken);
    const mile: MilestoneEvent = {
      type: 'milestone:reached',
      timestamp: 3,
      milestoneType: 'games_played',
      value: 10,
      description: '10 games',
    };
    bus.emit(mile);

    expect(starts).toHaveLength(1);
    expect(starts[0].type).toBe('game:start');
    expect(all).toHaveLength(3);

    offStart();
    bus.emit(gameStart({ timestamp: 4, isFirstTime: false, timesPlayed: 1 }));
    expect(starts).toHaveLength(1);
    expect(all).toHaveLength(4);

    offAll();
    bus.emit({
      type: 'app:start',
      timestamp: 5,
      isFirstVisit: false,
      daysSinceLastVisit: 1,
    });
    expect(all).toHaveLength(4);
  });

  it('off without handler clears type; emit with no listeners is fine', () => {
    const bus = new OwlEventEmitter();
    const spy = vi.fn();
    bus.on('tutorial:start', spy);
    bus.off('tutorial:start');
    bus.emit({
      type: 'tutorial:start',
      timestamp: 1,
      gameId: 'x',
      gameName: 'X',
    });
    expect(spy).not.toHaveBeenCalled();
    expect(() =>
      bus.emit({
        type: 'milestone:reached',
        timestamp: 2,
        milestoneType: 'games_won',
        value: 10,
        description: 'wins',
      })
    ).not.toThrow();
  });

  it('clear wipes all listeners', () => {
    const bus = new OwlEventEmitter();
    const spy = vi.fn();
    bus.on('*', spy);
    bus.on('game:end', spy);
    bus.clear();
    bus.emit({
      type: 'game:end',
      timestamp: 1,
      gameId: 'hex',
      gameName: 'Hex',
      playerWon: true,
      isDraw: false,
      duration: 10,
      moveCount: 5,
      winStreak: 1,
      isNewBestStreak: false,
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
