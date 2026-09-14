/**
 * Wave 43 TOKENMAXX — Star Track draw exhaust position settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { drawChains } from '../../src/games/star-track/rules';
import { createInitialState, type ChainLink } from '../../src/games/star-track/types';

describe('Wave 43 star-track — draw exhaust positions', () => {
  it('bucket < 2 ends game by position (p1 / p2 / tie)', () => {
    const base = createInitialState();
    const thin = (p1: number, p2: number, bucket: ChainLink[]) =>
      drawChains({
        ...base,
        player1Position: p1,
        player2Position: p2,
        chainBucket: bucket,
        phase: 'drawChains',
      });

    const one: ChainLink[] = [{ length: 3, id: 1 }];
    expect(thin(8, 3, one)).toMatchObject({ phase: 'gameOver', winner: 'player1' });
    expect(thin(2, 9, one)).toMatchObject({ phase: 'gameOver', winner: 'player2' });
    expect(thin(4, 4, [])).toMatchObject({ phase: 'gameOver', winner: null });
  });
});
