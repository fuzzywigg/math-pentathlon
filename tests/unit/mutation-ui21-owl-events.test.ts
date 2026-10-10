/**
 * q-mp-587 mutation audit UI wave 21 — owl-events first-window re-pins.
 * Structural emit / off / clear behavior only — no player-facing copy.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  OwlEventEmitter,
  type GameStartEvent,
  type OwlEvent,
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

describe('mutation-ui21 owl-events', () => {
  it('on() empty-slot || seeds handler arrays (kills L114 ||→&&)', () => {
    const emitter = new OwlEventEmitter();
    const seen: string[] = [];
    emitter.on('game:start', (e) => seen.push(e.type));
    emitter.emit(gameStart());
    expect(seen).toEqual(['game:start']);
  });

  it('unsubscribe filter keeps other handlers (kills L120 || / L123 !==)', () => {
    const emitter = new OwlEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    const offA = emitter.on('game:start', a);
    emitter.on('game:start', b);
    offA();
    emitter.emit(gameStart());
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('emit routes specific then wildcard via || defaults (kills L130/L136)', () => {
    const emitter = new OwlEventEmitter();
    const order: string[] = [];
    emitter.on('game:start', () => order.push('specific'));
    emitter.on('*', () => order.push('wild'));
    emitter.emit(gameStart());
    expect(order).toEqual(['specific', 'wild']);

    // Fresh type with no prior on() — empty || [] must not throw.
    const quiet = new OwlEventEmitter();
    expect(() => quiet.emit(gameStart({ type: 'game:start' }))).not.toThrow();
  });

  it('off without handler deletes type; with handler filters (kills L143 ! / L146 || / L149 !==)', () => {
    const emitter = new OwlEventEmitter();
    const keep = vi.fn();
    const drop = vi.fn();
    emitter.on('streak:update', keep);
    emitter.on('streak:update', drop);
    emitter.off('streak:update', drop);
    const evt: OwlEvent = {
      type: 'streak:update',
      timestamp: 1,
      currentStreak: 2,
      isNewRecord: false,
      previousBest: 1,
    };
    emitter.emit(evt);
    expect(keep).toHaveBeenCalledTimes(1);
    expect(drop).not.toHaveBeenCalled();

    emitter.off('streak:update');
    emitter.emit(evt);
    expect(keep).toHaveBeenCalledTimes(1);
  });

  it('clear() drops every handler map entry', () => {
    const emitter = new OwlEventEmitter();
    const fn = vi.fn();
    emitter.on('*', fn);
    emitter.on('game:end', fn);
    emitter.clear();
    emitter.emit({
      type: 'game:end',
      timestamp: 1,
      gameId: 'hex',
      gameName: 'Hex',
      playerWon: false,
      isDraw: false,
      duration: 1,
      moveCount: 0,
      winStreak: 0,
      isNewBestStreak: false,
    });
    expect(fn).not.toHaveBeenCalled();
  });
});
