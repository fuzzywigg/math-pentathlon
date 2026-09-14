/**
 * Wave 42 handshake — frac-fact × pinball × hex openings.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as pinInit } from '../../src/games/fraction-pinball/types';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { startGame as fracStart } from '../../src/games/frac-fact/rules';
import { startGame as pinStart } from '../../src/games/fraction-pinball/rules';
import { getValidMoves } from '../../src/games/hex/rules';

describe('Wave 42 handshake — frac × pinball × hex', () => {
  it('quiz games start without challenge until startGame', () => {
    expect(fracInit().currentProblem).toBeNull();
    expect(pinInit().currentChallenge).toBeNull();
    expect(fracStart(fracInit()).currentProblem).not.toBeNull();
    expect(pinStart(pinInit()).currentChallenge).not.toBeNull();
  });

  it('hex board empty and full of valids', () => {
    const h = hexInit(5);
    expect(h.winner).toBeNull();
    expect(getValidMoves(h)).toHaveLength(25);
  });
});
