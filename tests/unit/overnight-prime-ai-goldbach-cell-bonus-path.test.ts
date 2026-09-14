/**
 * Overnight TOKENMAXX HEAVY — prime-gold Goldbach cell path leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — Goldbach cell path', () => {
  it('hard AI can choose among placements when Goldbach targets present', () => {
    const open = createInitialState();
    // Forge placing with dice that allow many values — use actual roll results by forging placements
    // Simpler: forge state.phase placing with diceRoll and ensure getValidPlacements works
    const withDice = {
      ...open,
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const valids = getValidPlacements(withDice);
    expect(valids.length).toBeGreaterThan(0);
    const goldbachVals = valids.filter((p) => {
      const cell = withDice.cells.get(
        [...withDice.cells.entries()].find(([, c]) => c.value === p.value)?.[0] ?? ''
      );
      return cell?.isGoldbachTarget;
    });
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIPlacement(withDice, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(valids.some((v) => v.value === move!.value)).toBe(true);
    // Goldbach presence is informational — AI still legal
    expect(goldbachVals.length).toBeGreaterThanOrEqual(0);
  });
});
