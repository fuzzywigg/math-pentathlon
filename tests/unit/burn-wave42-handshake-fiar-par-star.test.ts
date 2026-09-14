/**
 * Wave 42 HEAVY — handshake: fiar × par-55 × star-track cross-seat.
 * Leftover engines (not #187 set). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as fiarInit, getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { getOpponent as parOpp } from '../../src/games/par-55/types';
import { createInitialState as starInit, getOpponent as starOpp } from '../../src/games/star-track/types';

describe('Wave 42 handshake — fiar × par-55 × star-track', () => {
  it('seat + opponent isomorphism across three leftovers', () => {
    const engines = [fiarInit(), parInit(), starInit()];
    for (const s of engines) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
    }
    expect(fiarOpp('player1')).toBe(parOpp('player1'));
    expect(parOpp('player2')).toBe(starOpp('player2'));
  });

  it('board/hand/track resources are non-empty at open', () => {
    const f = fiarInit();
    const p = parInit();
    const s = starInit();
    expect(f.board.nodes.size).toBe(25);
    expect(p.hands.player1.length + p.hands.player2.length).toBeGreaterThan(0);
    expect(s.chainBucket.length).toBeGreaterThan(1);
  });

  it('selection pointers start null', () => {
    expect(fiarInit().selectedNode).toBeNull();
    expect(parInit().selectedBlock).toBeNull();
    expect(starInit().drawnChains).toBeNull();
    expect(starInit().selectedChain).toBeNull();
  });
});
