/**
 * Wave 41 — Star Track selectChain clamp / identity / unused return.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { selectChain } from '../../src/games/star-track/rules';
import {
  createInitialState,
  TRACK_LENGTH,
  type ChainLink,
  type StarTrackGameState,
} from '../../src/games/star-track/types';

function chain(id: number, length: 1 | 2 | 3 | 4 | 5 | 6): ChainLink {
  return { id, length };
}

describe('Wave 41 Star Track — selectChain clamp / identity', () => {
  it('identity when phase wrong or drawnChains null', () => {
    const base = createInitialState();
    expect(selectChain(base, 0)).toBe(base);
    const forged: StarTrackGameState = {
      ...base,
      phase: 'selectChain',
      drawnChains: null,
    };
    expect(selectChain(forged, 1)).toBe(forged);
  });

  it('selects index 0; returns unused to bucket; advances seat', () => {
    const a = chain(10, 3);
    const b = chain(11, 5);
    const state: StarTrackGameState = {
      ...createInitialState(),
      phase: 'selectChain',
      drawnChains: [a, b],
      chainBucket: [chain(1, 1)],
      player1Position: 2,
    };
    const next = selectChain(state, 0);
    expect(next.selectedChain).toEqual(a);
    expect(next.player1Position).toBe(5);
    expect(next.drawnChains).toBeNull();
    expect(next.chainBucket).toContainEqual(b);
    expect(next.phase).toBe('drawChains');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].fromPosition).toBe(2);
    expect(next.moveHistory[0].toPosition).toBe(5);
  });

  it('clamps position at TRACK_LENGTH and ends game as winner', () => {
    const a = chain(20, 6);
    const b = chain(21, 1);
    const state: StarTrackGameState = {
      ...createInitialState(),
      phase: 'selectChain',
      drawnChains: [a, b],
      player1Position: TRACK_LENGTH - 2,
    };
    const next = selectChain(state, 0);
    expect(next.player1Position).toBe(TRACK_LENGTH);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player1');
  });

  it('select index 1 uses second chain', () => {
    const a = chain(30, 2);
    const b = chain(31, 4);
    const state: StarTrackGameState = {
      ...createInitialState(),
      phase: 'selectChain',
      drawnChains: [a, b],
      player1Position: 0,
    };
    const next = selectChain(state, 1);
    expect(next.selectedChain).toEqual(b);
    expect(next.player1Position).toBe(4);
    expect(next.chainBucket).toContainEqual(a);
  });
});
