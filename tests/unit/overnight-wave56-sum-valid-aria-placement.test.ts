/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum valid aria placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — valid aria placement', () => {
  it('valid empty cell aria includes valid placement leftover', () => {
    const base = createInitialState();
    const hand = base.hands.player1;
    let found = false;
    for (const dieA of [1, 2, 3, 4, 5, 6]) {
      for (const dieB of [1, 2, 3, 4, 5, 6]) {
        const dice: [number, number] = [dieA, dieB];
        const sum = getDiceSum(dice);
        for (const domino of hand) {
          const placements = getValidPlacements(base, domino, sum);
          if (!placements.length) continue;
          const state = {
            ...base,
            phase: 'placing' as const,
            currentDice: dice,
            selectedDomino: domino.id,
          };
          const el = renderBoard(state, () => undefined);
          const valid = el.querySelector('.sd-cell-valid');
          expect(valid?.getAttribute('aria-label')).toMatch(/valid placement/);
          found = true;
          return;
        }
      }
    }
    expect(found).toBe(true);
  });
});
