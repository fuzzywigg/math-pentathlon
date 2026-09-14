/**
 * Overnight TOKENMAXX — frac×hex openings handshake leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { getValidMoves } from '../../src/games/hex/rules';

describe('Overnight handshake — frac×hex', () => {
  it('frac starts with problem; hex 3x3 has 9 valids', () => {
    const frac = startGame(fracInit('easy'));
    expect(frac.currentProblem).not.toBeNull();
    expect(getValidMoves(hexInit(3))).toHaveLength(9);
  });
});
