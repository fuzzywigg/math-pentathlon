/**
 * Wave 53 leftover after #235 — Fab op valid class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
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

describe('Wave 53 fab — op valid', () => {
  it('marks matching operations with .fab-op-valid', () => {
    const base = createInitialState();
    const found = findMatch(base);
    expect(found).not.toBeNull();
    const state = selectBar2(selectBar1(base, found!.b1), found!.b2);
    const el = renderOperationSelector(state, () => undefined);
    expect(el.querySelectorAll('.fab-op-valid').length).toBeGreaterThan(0);
  });
});
