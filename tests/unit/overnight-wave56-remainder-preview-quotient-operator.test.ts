/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder preview quotient/operator. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderDivisionPreview } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — preview quotient operator', () => {
  it('equation mounts ÷ R quotient leftover', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const roll = { die1: 3, die2: 4, total: 7 };
    const el = renderDivisionPreview({
      ...base,
      currentRoll: roll,
      selectedIsland: island.id,
      phase: 'selectIsland',
    });
    expect(el.querySelector('.operator')?.textContent).toBe('÷');
    expect(el.querySelector('.r-label')?.textContent).toBe('R');
    expect(el.querySelector('.quotient')?.textContent).toBe(
      String(Math.floor(7 / island.value))
    );
    expect(el.querySelector('.dividend')?.textContent).toBe('7');
    expect(el.querySelector('.divisor')?.textContent).toBe(String(island.value));
  });
});
