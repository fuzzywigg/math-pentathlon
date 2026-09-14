/**
 * Wave 44 overnight HEAVY — Fab applyAIMoveSteps execute fail → pass.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, applyAIMoveSteps } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — apply bad answer', () => {
  it('passes when answer does not match', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'hard');
    expect(move).not.toBeNull();
    // Swap to a wrong answer id that won't match the op result
    const wrongAns = [...s.answerBars.keys()].find((id) => id !== move!.answerId)!;
    const next = applyAIMoveSteps(s, { ...move!, answerId: wrongAns });
    // Either succeeds luckily if equivalent, or passes — assert no stall in confirmingMove
    expect(next.phase).not.toBe('confirmingMove');
  });
});
