/**
 * Overnight TOKENMAXX HEAVY — prime-gold AI hard legal placement leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice, getValidPlacements } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — AI hard legal placement', () => {
  it('hard AI returns a valid placement after seeded roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    // Force dice via multiple rolls until placing has moves
    for (let i = 0; i < 20; i++) {
      state = rollDice({ ...createInitialState(), phase: 'rolling' });
      if (state.phase === 'placing' && getValidPlacements(state).length > 0) break;
    }
    expect(state.phase).toBe('placing');
    const move = getAIPlacement(state, 'player1', 'hard');
    if (getValidPlacements(state).length === 0) {
      expect(move).toBeNull();
    } else {
      expect(move).not.toBeNull();
      expect(getValidPlacements(state).some((p) => p.value === move!.value)).toBe(true);
    }
  });
});
