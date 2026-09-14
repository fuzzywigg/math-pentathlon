/**
 * Wave 51 leftover after #233 — Sum Dominoes board valid class edge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 sum — board valid class', () => {
  it('marks .sd-cell-valid when domino+dice selected', () => {
    const base = createInitialState();
    const dice: [number, number] = [3, 4];
    const hand = base.hands.player1;
    let chosen = hand[0];
    let placements = getValidPlacements(
      { ...base, currentDice: dice, selectedDomino: chosen.id, phase: 'placing' as const },
      chosen,
      getDiceSum(dice)
    );
    for (const d of hand) {
      const p = getValidPlacements(
        { ...base, currentDice: dice, selectedDomino: d.id, phase: 'placing' as const },
        d,
        getDiceSum(dice)
      );
      if (p.length > 0) {
        chosen = d;
        placements = p;
        break;
      }
    }
    expect(placements.length).toBeGreaterThan(0);
    const state = {
      ...base,
      currentDice: dice,
      selectedDomino: chosen.id,
      phase: 'placing' as const,
    };
    const el = renderBoard(state, () => undefined);
    expect(el.querySelectorAll('.sd-cell-valid').length).toBeGreaterThan(0);
  });
});
