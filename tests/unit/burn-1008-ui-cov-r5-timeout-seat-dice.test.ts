/**
 * burn-1008-mp-ui-coverage-round-5 — timeout-handle, seat-labels, die-faces.
 * Characterization only: structural / API-contract guards; no player-facing
 * copy asserts; no AI move-choice / timing.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bumpGeneration,
  clearGenerationTimeout,
  clearNullableTimeout,
  createGenerationTimeoutHandle,
  scheduleGenerationGated,
  scheduleGenerationTimeout,
} from '../../src/ui/timeout-handle';
import {
  formatModeSeatLabel,
  formatModeSeatLabelComputer,
  getOpponentSeat,
  getPlayerName,
} from '../../src/ui/seat-labels';
import {
  getDieFaceEmoji,
  getDieFaceEmojiOrQuestion,
} from '../../src/ui/die-faces';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('burn-1008 ui-cov-r5 timeout-handle', () => {
  it('clearNullableTimeout clears a live timer and is null-safe', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(globalThis, 'clearTimeout');
    const id = setTimeout(() => undefined, 50);
    expect(clearNullableTimeout(id)).toBeNull();
    expect(spy).toHaveBeenCalledWith(id);
    expect(clearNullableTimeout(null)).toBeNull();
  });

  it('create / clear / bump + scheduleGenerationTimeout respects generation', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    expect(handle.timer).toBeNull();
    expect(handle.generation).toBe(0);

    const ran = vi.fn();
    scheduleGenerationTimeout(handle, ran, 25);
    expect(handle.timer).not.toBeNull();
    vi.advanceTimersByTime(25);
    expect(ran).toHaveBeenCalledTimes(1);
    expect(handle.timer).toBeNull();

    const skipped = vi.fn();
    scheduleGenerationTimeout(handle, skipped, 40);
    bumpGeneration(handle);
    expect(handle.generation).toBe(1);
    vi.advanceTimersByTime(40);
    expect(skipped).not.toHaveBeenCalled();

    clearGenerationTimeout(handle);
    expect(handle.timer).toBeNull();
  });

  it('scheduleGenerationGated no-ops after generation changes', () => {
    vi.useFakeTimers();
    let timer: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;
    const ran = vi.fn();
    scheduleGenerationGated(
      {
        clearTimer: () => {
          if (timer !== null) clearTimeout(timer);
          timer = null;
        },
        setTimer: (id) => {
          timer = id;
        },
        getGeneration: () => generation,
      },
      ran,
      30
    );
    generation += 1;
    vi.advanceTimersByTime(30);
    expect(ran).not.toHaveBeenCalled();
    expect(timer).toBeNull();
  });
});

describe('burn-1008 ui-cov-r5 seat-labels', () => {
  it('seat helpers distinguish seats/modes without pinning display copy', () => {
    // Structural only — never assert exact Blue/Red/You/Computer/AI strings.
    expect(getPlayerName('player1', false)).not.toBe(
      getPlayerName('player2', false)
    );
    expect(getPlayerName('player1', true)).not.toBe(
      getPlayerName('player2', true)
    );
    expect(getPlayerName('player1', true)).not.toBe(
      getPlayerName('player1', false)
    );

    expect(formatModeSeatLabel('player1', 'human-vs-human')).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-human')
    );
    expect(formatModeSeatLabel('player2', 'human-vs-ai')).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-human')
    );

    expect(formatModeSeatLabelComputer('player1', 'human-vs-ai')).not.toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-ai')
    );
    // Hex-a-Gone / Star Track vs Fraction Pinball opponent wording differs.
    expect(formatModeSeatLabel('player2', 'human-vs-ai')).not.toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-ai')
    );

    expect(getOpponentSeat('player1')).toBe('player2');
    expect(getOpponentSeat('player2')).toBe('player1');
  });
});

describe('burn-1008 ui-cov-r5 die-faces', () => {
  it('covers falsy-index and out-of-range fallbacks (documented contracts)', () => {
    // Historical: index 0 is '' (falsy) → String(0) === "0".
    expect(getDieFaceEmoji(0)).toBe('0');
    expect(getDieFaceEmoji(7)).toBe('7');
    expect(getDieFaceEmoji(1)).not.toBe(getDieFaceEmoji(2));
    expect(getDieFaceEmoji(6).length).toBeGreaterThan(0);

    expect(getDieFaceEmojiOrQuestion(0)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(7)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(1)).not.toBe(
      getDieFaceEmojiOrQuestion(2)
    );
  });
});
