import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canPrefetchGame,
  isGamePrefetchStarted,
  prefetchGameChunk,
  prefetchGameChunksIdle,
  resetGamePrefetchForTests,
} from '../../src/ui/game-prefetch';

describe('game-prefetch', () => {
  beforeEach(() => {
    resetGamePrefetchForTests();
  });

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

  it('idle prefetch caps the queue (sync under Vitest — no deferred imports)', () => {
    // Under MODE=test, idle work runs immediately so game-selector renders
    // cannot leave requestIdleCallback/setTimeout imports after jsdom teardown.
    const idleSpy = vi.fn();
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: idleSpy,
    });

    prefetchGameChunksIdle(['hex', 'calla', 'fiar', 'star-track', 'bogus'], {
      max: 2,
    });

    expect(idleSpy).not.toHaveBeenCalled();
    expect(isGamePrefetchStarted('hex')).toBe(true);
    expect(isGamePrefetchStarted('calla')).toBe(true);
    expect(isGamePrefetchStarted('fiar')).toBe(false);
    expect(isGamePrefetchStarted('bogus')).toBe(false);
  });

  it('reset clears started marks without leaving deferred idle work', () => {
    prefetchGameChunksIdle(['hex', 'calla'], { max: 2 });
    expect(isGamePrefetchStarted('hex')).toBe(true);
    resetGamePrefetchForTests();
    expect(isGamePrefetchStarted('hex')).toBe(false);
  });
});
