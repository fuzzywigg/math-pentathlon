/**
 * Wave 41 — Star Track drawChains bucket edges (empty / one / two+).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { drawChains } from '../../src/games/star-track/rules';
import {
  createInitialState,
  type ChainLink,
  type StarTrackGameState,
} from '../../src/games/star-track/types';

function chain(id: number, length: 1 | 2 | 3 | 4 | 5 | 6): ChainLink {
  return { id, length };
}

function withBucket(
  bucket: ChainLink[],
  overrides: Partial<StarTrackGameState> = {}
): StarTrackGameState {
  return {
    ...createInitialState(),
    chainBucket: bucket,
    phase: 'drawChains',
    ...overrides,
  };
}

describe('Wave 41 Star Track — drawChains bucket edges', () => {
  it('empty bucket → gameOver with position-based winner or null tie', () => {
    const p1 = drawChains(
      withBucket([], { player1Position: 9, player2Position: 4 })
    );
    expect(p1.phase).toBe('gameOver');
    expect(p1.winner).toBe('player1');

    const p2 = drawChains(
      withBucket([], { player1Position: 2, player2Position: 7 })
    );
    expect(p2.winner).toBe('player2');

    const tie = drawChains(
      withBucket([], { player1Position: 5, player2Position: 5 })
    );
    expect(tie.winner).toBeNull();
  });

  it('single chain cannot offer a choice → gameOver', () => {
    const result = drawChains(withBucket([chain(1, 4)]));
    expect(result.phase).toBe('gameOver');
    expect(result.drawnChains).toBeNull();
  });

  it('two+ chains pop pair into drawnChains and leave remainder', () => {
    const c1 = chain(1, 2);
    const c2 = chain(2, 5);
    const c3 = chain(3, 1);
    const result = drawChains(withBucket([c1, c2, c3]));
    expect(result.phase).toBe('selectChain');
    expect(result.drawnChains).toEqual([c3, c2]);
    expect(result.chainBucket).toEqual([c1]);
  });

  it('identity when phase is not drawChains', () => {
    const state = withBucket([chain(1, 2), chain(2, 3)], {
      phase: 'selectChain',
    });
    expect(drawChains(state)).toBe(state);
  });
});
