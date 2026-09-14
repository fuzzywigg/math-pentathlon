/**
 * Wave 44 — sum-dominoes doRollDice × core dice roller handshake. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/sum-dominoes/rules';
import { rollDice } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 handshake — sum × dice roll', () => {
  it('seeded rolls keep both paths in 2d6 range', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 6) / 6;
    });
    const state = doRollDice(createInitialState());
    expect(state.currentDice).not.toBeNull();
    const [a, b] = state.currentDice!;
    expect(a).toBeGreaterThanOrEqual(1);
    expect(a).toBeLessThanOrEqual(6);
    expect(b).toBeGreaterThanOrEqual(1);
    expect(b).toBeLessThanOrEqual(6);
    expect(['placing', 'passing']).toContain(state.phase);

    const core = rollDice({ dice: ['d6', 'd6'] });
    expect(core.rolls).toHaveLength(2);
    expect(core.total).toBeGreaterThanOrEqual(2);
    expect(core.total).toBeLessThanOrEqual(12);
  });
});
