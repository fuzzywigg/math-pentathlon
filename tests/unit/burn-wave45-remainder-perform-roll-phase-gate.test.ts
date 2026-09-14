/**
 * Wave 45 TOKENMAXX — Remainder performRoll phase gate leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { performRoll } from '../../src/games/remainder-islands/rules';

describe('Wave 45 remainder — performRoll gates', () => {
  it('identity outside rolling; advances from rolling', () => {
    const open = createInitialState();
    const select = {
      ...open,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 2, total: 3 },
    };
    expect(performRoll(select)).toBe(select);
    const next = performRoll(open);
    expect(['selectIsland', 'rolling']).toContain(next.phase);
    expect(next).not.toBe(open);
  });
});
