import { describe, it, expect } from 'vitest';
import { drawChains, selectChain, isGameOver, getProgress, getPhaseMessage } from '../../src/games/star-track/rules';
import {
  StarTrackGameState,
  ChainLink,
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

function makeChain(id: number, length: 1 | 2 | 3 | 4 | 5 | 6): ChainLink {
  return { id, length };
}

function stateWithBucket(
  bucket: ChainLink[],
  overrides: Partial<StarTrackGameState> = {}
): StarTrackGameState {
  return {
    currentPlayer: 'player1',
    phase: 'drawChains',
    player1Position: 0,
    player2Position: 0,
    drawnChains: null,
    selectedChain: null,
    winner: null,
    moveHistory: [],
    chainBucket: bucket,
    ...overrides,
  };
}

describe('Star Track – drawChains (bucket depletion)', () => {
  it('normal draw: pops 2 distinct chains and transitions to selectChain', () => {
    const c1 = makeChain(1, 3);
    const c2 = makeChain(2, 5);
    const state = stateWithBucket([c1, c2]);

    const result = drawChains(state);

    expect(result.phase).toBe('selectChain');
    expect(result.drawnChains).not.toBeNull();
    expect(result.drawnChains![0]).not.toBe(result.drawnChains![1]);
    expect(result.chainBucket).toHaveLength(0);
  });

  it('does nothing when phase is not drawChains', () => {
    const state = stateWithBucket([makeChain(1, 2), makeChain(2, 4)], { phase: 'selectChain' });
    const result = drawChains(state);
    expect(result).toBe(state); // same reference
  });

  // ── Empty bucket ─────────────────────────────────────────────────────────
  it('empty bucket: transitions to gameOver instead of getting stuck', () => {
    const state = stateWithBucket([]);
    const result = drawChains(state);

    expect(result.phase).toBe('gameOver');
    expect(result.phase).not.toBe('drawChains'); // was the stuck state
  });

  it('empty bucket: calling drawChains again on result does not mutate (idempotent stuck-check)', () => {
    const state = stateWithBucket([]);
    const result1 = drawChains(state);
    const result2 = drawChains(result1); // phase is now gameOver, guard should bail out
    expect(result2).toBe(result1); // no infinite loop — guard returns early
  });

  it('empty bucket + player1 ahead: player1 wins', () => {
    const state = stateWithBucket([], { player1Position: 8, player2Position: 5 });
    const result = drawChains(state);

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
  });

  it('empty bucket + player2 ahead: player2 wins', () => {
    const state = stateWithBucket([], { player1Position: 3, player2Position: 7 });
    const result = drawChains(state);

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player2');
  });

  it('empty bucket + tied positions: winner is null (draw)', () => {
    const state = stateWithBucket([], { player1Position: 5, player2Position: 5 });
    const result = drawChains(state);

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBeNull();
  });

  // ── Single chain remaining ────────────────────────────────────────────────
  it('single chain: transitions to gameOver instead of degenerate choice', () => {
    const state = stateWithBucket([makeChain(1, 3)]);
    const result = drawChains(state);

    expect(result.phase).toBe('gameOver');
  });

  it('single chain + player1 further: player1 wins', () => {
    const state = stateWithBucket([makeChain(1, 2)], { player1Position: 9, player2Position: 6 });
    const result = drawChains(state);

    expect(result.winner).toBe('player1');
  });

  it('single chain + player2 further: player2 wins', () => {
    const state = stateWithBucket([makeChain(1, 2)], { player1Position: 2, player2Position: 4 });
    const result = drawChains(state);

    expect(result.winner).toBe('player2');
  });

  it('single chain + tied positions: draw', () => {
    const state = stateWithBucket([makeChain(1, 2)], { player1Position: 4, player2Position: 4 });
    const result = drawChains(state);

    expect(result.winner).toBeNull();
  });
});

describe('Star Track – selectChain', () => {
  it('selecting index 0 advances position and returns unused chain to bucket', () => {
    const c1 = makeChain(1, 3);
    const c2 = makeChain(2, 5);
    const state = stateWithBucket([], {
      phase: 'selectChain',
      drawnChains: [c1, c2],
      player1Position: 2,
    });

    const result = selectChain(state, 0);

    expect(result.selectedChain).toBe(c1);
    expect(result.player1Position).toBe(5); // 2 + 3
    expect(result.chainBucket).toContainEqual(c2); // unused returned
  });

  it('selecting index 1 uses second chain', () => {
    const c1 = makeChain(1, 3);
    const c2 = makeChain(2, 5);
    const state = stateWithBucket([], {
      phase: 'selectChain',
      drawnChains: [c1, c2],
      player1Position: 2,
    });

    const result = selectChain(state, 1);

    expect(result.selectedChain).toBe(c2);
    expect(result.player1Position).toBe(7); // 2 + 5
    expect(result.chainBucket).toContainEqual(c1);
  });

  it('reaching TRACK_LENGTH triggers gameOver with correct winner', () => {
    const c1 = makeChain(1, 6);
    const c2 = makeChain(2, 1);
    const state = stateWithBucket([], {
      phase: 'selectChain',
      drawnChains: [c1, c2],
      player1Position: 10,
      currentPlayer: 'player1',
    });

    const result = selectChain(state, 0);

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
  });

  it('position is capped at TRACK_LENGTH on overshoot', () => {
    const c1 = makeChain(1, 6);
    const c2 = makeChain(2, 1);
    const state = stateWithBucket([], {
      phase: 'selectChain',
      drawnChains: [c1, c2],
      player1Position: 11, // 1 away from goal
      currentPlayer: 'player1',
    });

    const result = selectChain(state, 0);

    expect(result.player1Position).toBe(TRACK_LENGTH);
    expect(result.winner).toBe('player1');
  });
});

describe('Star Track – isGameOver', () => {
  it('returns false at game start', () => {
    expect(isGameOver(createInitialState())).toBe(false);
  });

  it('returns true when phase is gameOver', () => {
    const state = stateWithBucket([], { phase: 'gameOver', winner: null });
    expect(isGameOver(state)).toBe(true);
  });

  it('returns true when winner is set', () => {
    const state = stateWithBucket([], { winner: 'player2', phase: 'drawChains' });
    expect(isGameOver(state)).toBe(true);
  });
});

describe('Star Track – getProgress', () => {
  it('returns 0 at start', () => {
    expect(getProgress(createInitialState(), 'player1')).toBe(0);
  });

  it('returns 100 when at TRACK_LENGTH', () => {
    const state = stateWithBucket([], { player1Position: TRACK_LENGTH });
    expect(getProgress(state, 'player1')).toBe(100);
  });
});

describe('Star Track – getPhaseMessage', () => {
  it('returns draw message when game ends with null winner', () => {
    const state = stateWithBucket([], { phase: 'gameOver', winner: null });
    expect(getPhaseMessage(state)).toContain('draw');
  });

  it('returns winner message when game ends with a winner', () => {
    const state = stateWithBucket([], { phase: 'gameOver', winner: 'player1' });
    expect(getPhaseMessage(state)).toContain('Blue');
  });
});
