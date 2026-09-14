/**
 * Wave 44 overnight HEAVY — Fab passTurn flips seat.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, selectBar1 } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — passTurn flip', () => {
  it('clears selection and flips to opponent when moves remain', () => {
    const s = createInitialState();
    const id = [...s.fractionBars.keys()][0];
    const mid = selectBar1(s, id);
    const next = passTurn(mid);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBar1).toBeNull();
    expect(next.phase).toBe('selectingBar1');
    expect(next.winner).toBeNull();
  });
});
