/**
 * Wave 53 leftover after #235 — Fab op selected class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
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

describe('Wave 53 fab — op selected', () => {
  it('adds .fab-op-selected on chosen operation', () => {
    const base = createInitialState();
    const found = findMatch(base);
    expect(found).not.toBeNull();
    let state = selectBar1(base, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    const el = renderOperationSelector(state, () => undefined);
    expect(el.querySelectorAll('.fab-op-selected').length).toBe(1);
  });
});
