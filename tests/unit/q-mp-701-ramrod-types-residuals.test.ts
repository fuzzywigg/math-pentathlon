/**
 * q-mp-701 — close `ramrod/types` residual gaps under the *ramrod*types* /
 * *ramrod* verification glob (tests-only).
 *
 * Tip baseline under that glob: ~92.3% lines / 66.7% branches (uncovered
 * L147 createRodSet count-miss continue, L168 shuffleArray hole continue).
 * Round-7 already covered the shuffle hole-guard, but
 * `engine-coverage-round-7-burn-1008.test.ts` does not match `*ramrod*`.
 *
 * Pins CURRENT helper behavior only. No src / AI / scoring / copy changes.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createRod,
  createRodSet,
  createBoxId,
  getOpponent,
  ROD_COLORS,
  shuffleArray,
} from '../../src/games/ramrod/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('q-mp-701 ramrod/types — shuffleArray hole-guard residual', () => {
  it('continues when Fisher-Yates slot a is undefined', () => {
    const input: Array<number | undefined> = [1, undefined, 3, 4, 5];
    // random=0 → j=0 every iteration; when i lands on the hole, a is undefined.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const out = shuffleArray(input);
    expect(out).toHaveLength(5);
    expect(
      out.filter((x): x is number => x !== undefined).sort((a, b) => a - b)
    ).toEqual([1, 3, 4, 5]);
    expect(input).toEqual([1, undefined, 3, 4, 5]);
  });

  it('continues when Fisher-Yates partner b is undefined', () => {
    const input: Array<string | undefined> = ['a', 'b', undefined, 'd'];
    // i=3 → want j=2 (hole): floor(random * 4) = 2 → random in [0.5, 0.75).
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const sequence = [0.5, 0, 0];
      return sequence[call++] ?? 0;
    });
    const out = shuffleArray(input);
    expect(out).toHaveLength(4);
    expect(
      out.filter((x): x is string => typeof x === 'string').sort()
    ).toEqual(['a', 'b', 'd']);
    expect(input).toEqual(['a', 'b', undefined, 'd']);
  });
});

describe('q-mp-701 ramrod/types — createRodSet count-miss documented unreachable', () => {
  it('emits every length 1–10 (count===undefined continue unreachable)', () => {
    // Documented unreachable: local `counts` Record defines every length 1–10,
    // so `if (count === undefined) continue` (~L146–148) never fires on the
    // public path. Acceptance allows documenting this arm rather than ≥98%.
    const set = createRodSet();
    const byLen = new Map<number, number>();
    for (const rod of set) {
      byLen.set(rod.length, (byLen.get(rod.length) ?? 0) + 1);
    }
    for (let length = 1; length <= 10; length++) {
      expect(byLen.has(length)).toBe(true);
    }
    expect(set.length).toBe(8 + 6 + 5 + 4 + 4 + 3 + 3 + 2 + 2 + 2);
  });

  it('createRod / createBoxId / getOpponent keep tip identities', () => {
    const rod = createRod('probe', 7);
    expect(rod.color).toBe(ROD_COLORS[7]);
    expect(rod.owner).toBeNull();
    expect(rod.position).toBeNull();
    // Tip runtime: unknown length yields undefined color (no fallback).
    expect(createRod('oob', 11).color).toBeUndefined();
    expect(createBoxId(2, 3)).toBe('box-2-3');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
