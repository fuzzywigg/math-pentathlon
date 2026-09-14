/**
 * Wave 44 overnight HEAVY — Fab executeMove reject matrix.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — executeMove rejects', () => {
  it('wrong phase / missing answer / already claimed', () => {
    const s = createInitialState();
    expect(executeMove(s, 'answer-0')).toBe(s);
    const [a, b] = [...s.fractionBars.keys()];
    const conf = selectOperation(selectBar2(selectBar1(s, a), b), 'add');
    expect(executeMove(conf, 'no-such-answer')).toBe(conf);
    const ansId = [...conf.answerBars.keys()][0];
    const claimed = {
      ...conf,
      answerBars: new Map(conf.answerBars).set(ansId, {
        ...conf.answerBars.get(ansId)!,
        claimedBy: 'player2',
      }),
    };
    expect(executeMove(claimed, ansId)).toBe(claimed);
  });
});
