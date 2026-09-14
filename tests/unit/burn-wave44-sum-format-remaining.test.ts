/**
 * Wave 44 — Sum Dominoes formatMove / remaining leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove, getRemainingCount, createInitialState } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — format / remaining', () => {
  it('format includes faces+sum; remaining tracks hands', () => {
    const s = createInitialState();
    const d = s.hands.player1[0];
    const text = formatMove({
      player: 'player1',
      domino: d,
      position: { row: 1, col: 1 },
      orientation: 'vertical',
      matchedFace: d.face1,
      adjacentFace: 6,
      diceSum: d.face1 + 6,
      moveNumber: 2,
    });
    expect(text).toContain(`[${d.face1}|${d.face2}]`);
    expect(getRemainingCount(s, 'player1')).toBe(7);
    expect(getRemainingCount(s, 'player2')).toBe(7);
  });

  it('remaining drops when hand emptied in fixture', () => {
    const s = createInitialState();
    const emptied = {
      ...s,
      hands: { ...s.hands, player1: [] },
    };
    expect(getRemainingCount(emptied, 'player1')).toBe(0);
  });
});
