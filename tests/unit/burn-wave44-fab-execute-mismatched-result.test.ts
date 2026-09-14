/**
 * Wave 44 overnight HEAVY — executeMove rejects non-equivalent answer.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 44 fab — execute mismatch', () => {
  it('identity when answer fraction does not match op result', () => {
    const s = createInitialState();
    const unused = [...s.fractionBars.values()];
    // pick two bars and add; find an answer that does NOT match
    const b1 = unused[0];
    const b2 = unused[1];
    const result = calculateResult(b1.fraction, b2.fraction, 'add');
    expect(result).not.toBeNull();
    const wrong = [...s.answerBars.entries()].find(
      ([, a]) => a.claimedBy === null && !areEquivalent(a.fraction, result!)
    );
    expect(wrong).toBeTruthy();
    const conf = selectOperation(selectBar2(selectBar1(s, b1.id), b2.id), 'add');
    expect(executeMove(conf, wrong![0])).toBe(conf);
  });
});
