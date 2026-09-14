/**
 * Wave 44 overnight HEAVY — Fab checkWinner near-exhausted bars.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, checkWinner } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — checkWinner bars near exhausted', () => {
  it('size-1 unused triggers score compare; equal → null', () => {
    const s = createInitialState();
    const bars = new Map(s.fractionBars);
    const ids = [...bars.keys()];
    ids.forEach((id, idx) => {
      bars.set(id, { ...bars.get(id)!, used: idx !== 0 });
    });
    const answers = new Map(s.answerBars);
    // leave answers not fully claimed; set claim counts via partial claims
    const aIds = [...answers.keys()];
    answers.set(aIds[0], { ...answers.get(aIds[0])!, claimedBy: 'player1' });
    answers.set(aIds[1], { ...answers.get(aIds[1])!, claimedBy: 'player2' });
    expect(checkWinner(answers, bars)).toBeNull();

    answers.set(aIds[2], { ...answers.get(aIds[2])!, claimedBy: 'player2' });
    expect(checkWinner(answers, bars)).toBe('player2');
  });
});
