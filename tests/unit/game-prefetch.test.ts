import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  canPrefetchGame,
  isGamePrefetchStarted,
  prefetchGameChunk,
  prefetchGameChunksIdle,
  resetGamePrefetchForTests,
} from '../../src/ui/game-prefetch';

describe('game-prefetch', () => {
  afterEach(() => {
    resetGamePrefetchForTests();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('knows registered practice games and rejects unknown ids', () => {
    expect(canPrefetchGame('hex')).toBe(true);
    expect(canPrefetchGame('calla')).toBe(true);
    expect(canPrefetchGame('not-a-game')).toBe(false);
  });

  it('marks a game as started once and does not double-fire', () => {
    prefetchGameChunk('hex');
    expect(isGamePrefetchStarted('hex')).toBe(true);
    prefetchGameChunk('hex');
    expect(isGamePrefetchStarted('hex')).toBe(true);
  });

  it('idle prefetch caps the queue and schedules work', () => {
    vi.useFakeTimers();
    const idleSpy = vi.fn((cb: IdleRequestCallback) => {
      cb({
        didTimeout: false,
        timeRemaining: () => 50,
      } as IdleDeadline);
      return 1;
    });
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: idleSpy,
    });

    prefetchGameChunksIdle(['hex', 'calla', 'fiar', 'star-track', 'bogus'], {
      max: 2,
    });

    expect(idleSpy).toHaveBeenCalledOnce();
    expect(isGamePrefetchStarted('hex')).toBe(true);
    expect(isGamePrefetchStarted('calla')).toBe(true);
    expect(isGamePrefetchStarted('fiar')).toBe(false);
    expect(isGamePrefetchStarted('bogus')).toBe(false);
  });
});
