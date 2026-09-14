/**
 * Wave 44 overnight HEAVY — Fab mutual no-move settle via pass.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab — pass settle', () => {
  it('gameOver when opponent also has no valid moves', () => {
    const s = createInitialState();
    const bars = new Map(s.fractionBars);
    for (const [id, b] of bars) bars.set(id, { ...b, used: true });
    // leave one unused so length < 2 after flip still hasAnyValidMove false
    const jammed: FabADiffyState = {
      ...s,
      fractionBars: bars,
      scores: { player1: 3, player2: 1 },
    };
    const next = passTurn(jammed);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('tie yields null winner', () => {
    const s = createInitialState();
    const bars = new Map(s.fractionBars);
    for (const [id, b] of bars) bars.set(id, { ...b, used: true });
    const jammed: FabADiffyState = {
      ...s,
      fractionBars: bars,
      scores: { player1: 2, player2: 2 },
    };
    const next = passTurn(jammed);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
