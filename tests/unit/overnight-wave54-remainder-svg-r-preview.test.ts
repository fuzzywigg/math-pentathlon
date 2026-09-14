/**
 * Overnight HEAVY leftover after #241 — on-hex R= overlay (not renderDivisionPreview). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { calculateDivision } from '../../src/games/remainder-islands/rules';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — svg R preview', () => {
  it('selected+roll paints R=remainder under the hex', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const roll = { die1: 4, die2: 3, total: 7 };
    const expected = calculateDivision(7, island.value).remainder;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: roll,
      selectedIsland: island.id,
      validIslands: [island.id],
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const texts = [...svg.querySelectorAll(`[data-island-id="${island.id}"] text`)].map(
      (t) => t.textContent
    );
    expect(texts).toContain(`R=${expected}`);
  });
});
