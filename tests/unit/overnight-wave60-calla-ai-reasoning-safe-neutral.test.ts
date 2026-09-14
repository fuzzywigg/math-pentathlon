/**
 * Wave 60 leftover after tip/#279 — Calla analyzeMoves safe-neutral exact.
 * Distinct from #289 free-turn/opponent reasons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 60 calla — AI safe neutral exact', () => {
  it('opening pit 0 is exact safe-neutral reasoning', () => {
    const pit0 = analyzeMoves(createInitialState(), 'player1').find(
      (a) => a.pit === 0
    );
    expect(pit0?.reasoning).toBe('A safe, neutral move.');
  });
});
