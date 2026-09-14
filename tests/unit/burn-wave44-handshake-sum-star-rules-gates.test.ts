/**
 * Wave 44 — Sum Dominoes × Star Track rules gate handshake leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createSum, passTurn as passSum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { selectChain as starSelect } from '../../src/games/star-track/rules';

describe('Wave 44 handshake — Sum × Star rules gates', () => {
  it('wrong-phase noops stay identity across engines', () => {
    const sum = createSum();
    const star = createStar();
    expect(passSum(sum)).toEqual(sum);
    expect(starSelect(star, 0)).toEqual(star);
  });
});
