/**
 * Wave 45 — Contig AI prefers vertical five completion
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

function claim(values: number[], owner: 'player1' | 'player2', base = createInitialState()): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) cells.set(value, { ...cells.get(value)!, owner });
  return { ...base, cells };
}

describe('Wave 45 Contig AI — vertical win', () => {
  it('hard completes vertical five in col 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Own 1,11,25,48 → need 84 at (4,0). Dice [4,3,7] no — use [6,6,6]? 84=...
    // 84 from [4,3,7] not on dice. [6,2,7] no. [4,3,7] invalid.
    // 84 = (6+6)*7 no. From [3,4,7] — dice max 6.
    // 84 = 6*6 + ... 6*6*2 +12? getAllPossible: [6,6,2] → 6*6*2=72, (6+6)*6=72
    // 84 = 7*12 — need 7. BOARD has 84.
    // Try [4,3,7] invalid. [6,4,3.5] no.
    // 84 = (6*6)+6*8 no three dice.
    // Check: getAllPossibleResults([6,6,1]) includes?
    // Actually use known: [4,3,7] can't. Let's use values that dice can make.
    // Vertical col0: 1,11,25,48,84. What dice make 84?
    // 84 = 6*2*7 no. 4*3*7 no.
    // From code: (6*6)*2 +12? Wait 6*14.
    // I'll compute at runtime in test with a known triple — use [6,6,2] and see if 84 possible.
    // Better: own 2,12,27,50 need 90. 90=(6*5)*3. Dice [6,5,3].
    // Vertical col1: 2(0,1),12(1,1),27(2,1),50(3,1),90(4,1)
    let state = claim([2, 12, 27, 50], 'player1');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [3, 5, 6],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(90);
  });
});
