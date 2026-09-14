/**
 * Overnight TOKENMAXX HEAVY — prime-gold AI teaching easy leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice, getValidPlacements } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

function placingWithMoves() {
  for (let seed = 0; seed < 30; seed++) {
    vi.spyOn(Math, 'random').mockImplementation(() => (seed * 0.037 + 0.11) % 1);
    const rolled = rollDice(createInitialState());
    vi.restoreAllMocks();
    if (rolled.phase === 'placing' && getValidPlacements(rolled).length > 1) return rolled;
  }
  return null;
}

describe('Overnight prime — AI teaching easy', () => {
  it('easy teaching returns a legal placement when moves exist', () => {
    const state = placingWithMoves();
    expect(state).not.toBeNull();
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const move = getAIPlacement(state!, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state!).some((p) => p.value === move!.value)).toBe(true);
  });
});
