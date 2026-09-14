/**
 * Wave 44 overnight HEAVY — Fab applyAIMoveSteps fails selectBar1 → pass.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { applyAIMoveSteps } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — apply bad bar1', () => {
  it('passes when bar1 invalid', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const s = createInitialState();
    const [b2] = [...s.fractionBars.keys()];
    const ans = [...s.answerBars.keys()][0];
    const next = applyAIMoveSteps(s, {
      bar1Id: 'nope',
      bar2Id: b2,
      operation: 'add',
      answerId: ans,
    });
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(0);
  });
});
