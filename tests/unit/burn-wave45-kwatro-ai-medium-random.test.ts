/**
 * Wave 45 — Kwatro medium randomness leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — AI medium', () => {
  afterEach(() => vi.restoreAllMocks());

  it('medium random band returns move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(getAIMove(createInitialState(), 'player1', 'medium')).not.toBeNull();
  });
});
