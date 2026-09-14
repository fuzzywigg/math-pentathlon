/**
 * Overnight HEAVY leftover after #229 — Prime Gold valid cell click path. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — valid cell click', () => {
  it('adds .valid and fires onCellClick with value/expr', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const target = placements[0];
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const valid = el.querySelector(`.pg-cell.valid[data-value="${target.value}"]`);
    expect(valid).toBeTruthy();
    (valid as HTMLElement).click();
    expect(onClick).toHaveBeenCalledWith(target.value, target.expr);
  });
});
