/**
 * Wave 42 — Handshake: Sum Dominoes / Contig AI null on wrong phase.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import { getAIMove } from '../../src/games/sum-dominoes/ai';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 42 handshake — Contig×Sum AI null', () => {
  it('rolling Contig and gameOver Sum Dominoes both null', () => {
    expect(getAIPlacement(contigInit(), 'player1', 'hard')).toBeNull();
    const sd: SumDominoesState = {
      board: emptyBoard(),
      hands: {
        player1: [{ id: 'a', face1: 1, face2: 1, owner: 'player1', orientation: 'horizontal' } as Domino],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [1, 1],
      selectedDomino: null,
      phase: 'gameOver',
      winner: 'player2',
      moveHistory: [],
      passCount: 2,
    };
    expect(getAIMove(sd, 'player1', 'hard')).toBeNull();
  });
});
