/**
 * Wave 43 — doRollDice placing vs passing leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
} from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 sd — roll placing vs passing', () => {
  it('seeded roll yields placing or passing; non-rolling identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const s = createInitialState();
    const rolled = doRollDice(s);
    expect(['placing', 'passing']).toContain(rolled.phase);
    expect(rolled.currentDice).not.toBeNull();
    expect(doRollDice(rolled)).toBe(rolled);
  });
});
