/**
 * Overnight HEAVY leftover after #241 — points-preview exact +N points. Tests-only.
 * Distinct from wave48 equation ÷/R presence.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { calculateDivision } from '../../src/games/remainder-islands/rules';
import { renderDivisionPreview } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — preview points exact', () => {
  it('points-preview is +remainder points', () => {
    const s = createInitialState();
    const island = s.islands[0]!;
    const remainder = calculateDivision(7, island.value).remainder;
    const el = renderDivisionPreview({
      ...s,
      currentRoll: { die1: 4, die2: 3, total: 7 },
      selectedIsland: island.id,
      phase: 'selectIsland',
    });
    expect(el.querySelector('.points-preview')?.textContent).toBe(`+${remainder} points`);
    expect(el.querySelector('.dividend')?.textContent).toBe('7');
    expect(el.querySelector('.divisor')?.textContent).toBe(String(island.value));
  });
});
