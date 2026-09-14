/**
 * Wave 46 — Prime Gold medium AI top-band leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

describe('Wave 46 prime — medium top band', () => {
  afterEach(() => vi.restoreAllMocks());

  it('medium with low random returns placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const rolled = rollDice(createInitialState());
    expect(getAIPlacement(rolled, 'player1', 'medium')).not.toBeNull();
  });
});
