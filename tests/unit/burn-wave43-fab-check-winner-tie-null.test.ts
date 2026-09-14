/**
 * Wave 43 TOKENMAXX — Fab checkWinner near-exhaust tie → null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, checkWinner } from '../../src/games/fab-a-diffy/rules';

describe('Wave 43 fab — checkWinner tie null', () => {
  it('near-exhaust equal claims yields null (not forced seat)', () => {
    const state = createInitialState();
    const answers = new Map(state.answerBars);
    const ids = [...answers.keys()];
    // leave some unclaimed so first branch skipped
    answers.set(ids[0], { ...answers.get(ids[0])!, claimedBy: 'player1' });
    answers.set(ids[1], { ...answers.get(ids[1])!, claimedBy: 'player2' });
    const bars = new Map(state.fractionBars);
    const barIds = [...bars.keys()];
    barIds.forEach((id, idx) => {
      bars.set(id, { ...bars.get(id)!, used: idx < barIds.length - 1 });
    });
    expect(checkWinner(answers, bars)).toBeNull();
  });

  it('sparse used bars does not trigger near-exhaust', () => {
    const state = createInitialState();
    expect(checkWinner(state.answerBars, state.fractionBars)).toBeNull();
  });
});
