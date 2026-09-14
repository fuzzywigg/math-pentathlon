/**
 * Wave 48 — Remainder renderDivisionPreview equation. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderDivisionPreview } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — division preview', () => {
  it('empty without roll/selection; equation when both set', () => {
    const s = createInitialState();
    expect(renderDivisionPreview(s).children.length).toBe(0);
    const island = s.islands[0];
    const withRoll = {
      ...s,
      currentRoll: { die1: 4, die2: 3, total: 7 },
      selectedIsland: island.id,
      phase: 'selectIsland' as const,
    };
    const el = renderDivisionPreview(withRoll);
    expect(el.querySelector('.division-equation')).toBeTruthy();
    expect(el.textContent).toMatch(/÷/);
    expect(el.textContent).toMatch(/R/);
    expect(el.querySelector('.points-preview')?.textContent).toMatch(/\+/);
  });
});
