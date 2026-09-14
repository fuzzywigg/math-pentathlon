/**
 * Wave 44 overnight HEAVY — Fab checkWinner all answers claimed.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, checkWinner } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — checkWinner all claimed', () => {
  it('majority claims wins when board full', () => {
    const s = createInitialState();
    const answers = new Map(s.answerBars);
    let i = 0;
    for (const [id, a] of answers) {
      answers.set(id, { ...a, claimedBy: i % 2 === 0 ? 'player1' : 'player2' });
      i++;
    }
    // Ensure P1 majority
    const ids = [...answers.keys()];
    answers.set(ids[0], { ...answers.get(ids[0])!, claimedBy: 'player1' });
    answers.set(ids[1], { ...answers.get(ids[1])!, claimedBy: 'player1' });
    const p1 = [...answers.values()].filter((a) => a.claimedBy === 'player1').length;
    const p2 = [...answers.values()].filter((a) => a.claimedBy === 'player2').length;
    expect(p1).toBeGreaterThan(p2);
    expect(checkWinner(answers, s.fractionBars)).toBe('player1');
  });
});
