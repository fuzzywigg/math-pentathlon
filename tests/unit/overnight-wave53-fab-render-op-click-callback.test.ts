/**
 * Wave 53 leftover after #235 — Fab op click callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';

function findMatch(state: ReturnType<typeof createInitialState>) {
  const unused = [...state.fractionBars.values()].filter((b) => !b.used);
  for (let i = 0; i < unused.length; i++) {
    for (let j = 0; j < unused.length; j++) {
      if (i === j) continue;
      for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
        const result = calculateResult(unused[i].fraction, unused[j].fraction, op);
        if (!result || result.numerator < 0) continue;
        const matches = findMatchingAnswers(state, result);
        if (matches.length) {
          return { b1: unused[i].id, b2: unused[j].id, op, ans: matches[0] };
        }
      }
    }
  }
  return null;
}

describe('Wave 53 fab — op click', () => {
  it('invokes onSelect with matched operation', () => {
    const base = createInitialState();
    const found = findMatch(base);
    expect(found).not.toBeNull();
    const state = selectBar2(selectBar1(base, found!.b1), found!.b2);
    const onSelect = vi.fn();
    const el = renderOperationSelector(state, onSelect);
    const valid = el.querySelector('.fab-op-valid') as HTMLButtonElement;
    expect(valid).toBeTruthy();
    valid.click();
    expect(onSelect).toHaveBeenCalled();
    expect(['add', 'subtract', 'multiply', 'divide']).toContain(onSelect.mock.calls[0][0]);
  });
});
