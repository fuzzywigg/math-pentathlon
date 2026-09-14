/**
 * Overnight HEAVY leftovers after #234 — Sum Dominoes sd-cell-valid highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDomino } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 sum — valid cell class', () => {
  it('adds sd-cell-valid when selected domino has placements for dice', () => {
    const base = createInitialState();
    // Forge placing state with dice that can match a hand domino against seed
    const hand = base.hands.player1;
    const state = {
      ...base,
      phase: 'placing' as const,
      currentDice: [6, 6] as [number, number],
      selectedDomino: hand[0]!.id,
    };
    // If selectDomino path preferred:
    const selected = selectDomino(
      { ...base, phase: 'placing', currentDice: [6, 6] },
      hand[0]!.id
    );
    const el = renderBoard(selected.selectedDomino ? selected : state, () => undefined);
    // May be zero if this particular domino cannot place on 12 — accept either
    // forged selected or skip when no valids; assert class only when present.
    const valids = el.querySelectorAll('.sd-cell-valid');
    if (valids.length === 0) {
      // Try each hand piece until one yields valids
      let found = 0;
      for (const d of hand) {
        const s = selectDomino(
          { ...base, phase: 'placing', currentDice: [6, 6] },
          d.id
        );
        const board = renderBoard(s, () => undefined);
        found = board.querySelectorAll('.sd-cell-valid').length;
        if (found > 0) break;
      }
      // Also try other common sums
      if (found === 0) {
        for (const dice of [
          [1, 1],
          [2, 3],
          [4, 5],
          [6, 5],
        ] as [number, number][]) {
          for (const d of hand) {
            const s = selectDomino(
              { ...base, phase: 'placing', currentDice: dice },
              d.id
            );
            const board = renderBoard(s, () => undefined);
            found = board.querySelectorAll('.sd-cell-valid').length;
            if (found > 0) break;
          }
          if (found > 0) break;
        }
      }
      expect(found).toBeGreaterThan(0);
    } else {
      expect(valids.length).toBeGreaterThan(0);
    }
  });
});
