/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Prime Gold valid cell keydown a11y.
 * Distinct from wave50 click-only path. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 51 prime residual — cell keydown', () => {
  it('Enter and Space on .pg-cell.valid fire onCellClick', () => {
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
    const valid = el.querySelector(
      `.pg-cell.valid[data-value="${target.value}"]`
    ) as HTMLElement;
    expect(valid).toBeTruthy();

    valid.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(target.value, target.expr);

    onClick.mockClear();
    valid.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(target.value, target.expr);
  });
});
