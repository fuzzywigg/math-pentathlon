/**
 * Wave 45 TOKENMAXX — Pinball easy teaching intentional miss leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 45 pinball — teaching miss', () => {
  it('easy teachingMode returns a wrong choice when random < 0.4', () => {
    // startGame must run with real randomness (constant mock loops challenge fill)
    const live = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const ans = getAIAnswer(live, 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(ans).not.toBe(live.currentChallenge!.correctAnswer);
    expect(live.currentChallenge!.answerChoices).toContain(ans!);
  });
});
