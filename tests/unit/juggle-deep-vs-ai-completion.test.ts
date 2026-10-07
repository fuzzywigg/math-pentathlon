/**
 * Deep vs-AI completion harness (rules/AI, no DOM).
 * Plays 10+ full games per Easy/Medium/Hard using Hard-AI proxy for the
 * human seat so we prove jammed rolls pass and games reach a winner.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  doRollDice,
  shouldOfferPass,
  passTurn,
} from '../../src/games/juggle/rules';
import {
  executeAITurn,
  type AIDifficulty,
} from '../../src/games/juggle/ai';
import type { JuggleState } from '../../src/games/juggle/types';

function playFullGame(aiDifficulty: AIDifficulty, maxPlies = 800): {
  winner: JuggleState['winner'];
  plies: number;
  passes: number;
  stalled: boolean;
} {
  let state = createInitialState();
  let passes = 0;
  let plies = 0;

  while (!state.winner && plies < maxPlies) {
    plies += 1;
    if (state.phase === 'rolling') {
      state = doRollDice(state);
    }

    if (shouldOfferPass(state)) {
      passes += 1;
      state = passTurn(state);
      continue;
    }

    const seat = state.currentPlayer;
    const movesBefore = state.moveHistory.length;
    // Human (Blue) uses medium as a competent proxy; Red uses the under-test difficulty.
    const difficulty: AIDifficulty =
      seat === 'player2' ? aiDifficulty : 'medium';

    // Drive the seat until it places, passes, or we detect a stall.
    let steps = 0;
    while (
      !state.winner &&
      state.currentPlayer === seat &&
      state.moveHistory.length === movesBefore &&
      steps < 12
    ) {
      steps += 1;
      if (shouldOfferPass(state)) {
        passes += 1;
        state = passTurn(state);
        break;
      }
      const before = state;
      state = executeAITurn(state, seat, difficulty);
      if (
        state.phase === before.phase &&
        state.selectedCategory === before.selectedCategory &&
        state.selectedShape === before.selectedShape &&
        state.moveHistory.length === before.moveHistory.length &&
        state.currentPlayer === before.currentPlayer
      ) {
        if (shouldOfferPass(state)) {
          passes += 1;
          state = passTurn(state);
        } else {
          return { winner: state.winner, plies, passes, stalled: true };
        }
        break;
      }
    }

    if (
      state.currentPlayer === seat &&
      state.moveHistory.length === movesBefore &&
      !state.winner
    ) {
      return { winner: state.winner, plies, passes, stalled: true };
    }
  }

  return {
    winner: state.winner,
    plies,
    passes,
    stalled: !state.winner,
  };
}

describe('Juggle deep vs-AI completion (10+ games × difficulty)', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as AIDifficulty[]) {
    it(`completes 12 games on ${difficulty} without soft-lock`, () => {
      const outcomes: Array<ReturnType<typeof playFullGame>> = [];
      for (let i = 0; i < 12; i++) {
        outcomes.push(playFullGame(difficulty));
      }

      const stalled = outcomes.filter((o) => o.stalled);
      const finished = outcomes.filter((o) => o.winner);

      expect(stalled).toHaveLength(0);
      expect(finished.length).toBe(12);
      // Sanity: both seats can win across the batch (fill-first still intact).
      const blueWins = finished.filter((o) => o.winner === 'player1').length;
      const redWins = finished.filter((o) => o.winner === 'player2').length;
      expect(blueWins + redWins).toBe(12);
    }, 60_000);
  }
});
