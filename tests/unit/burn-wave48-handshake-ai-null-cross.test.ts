/**
 * Wave 48 — Handshake AI null wrong-seat across four. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { createInitialState as pinInit } from '../../src/games/fraction-pinball/types';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { getAIMove } from '../../src/games/ramrod/ai';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 handshake — AI wrong seat null', () => {
  it('wrong seat null across engines', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const j = { ...juggleInit(), phase: 'selectingShape' as const, currentDice: [2, 3] as [number, number] };
    expect(getAIDieChoice(j, 'player2')).toBeNull();
    expect(getAIMove(ramrodInit(), 'player2')).toBeNull();
    const rem = {
      ...remInit(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 2, total: 3 },
      validIslands: remInit().islands.slice(0, 1).map((i) => i.id),
    };
    expect(getAIIslandChoice(rem, 'player2', 'hard')).toBeNull();
    // Avoid startGame/generateChallenge under constant Math.random (fill-loop OOM).
    const pin = {
      ...pinInit(),
      phase: 'answering' as const,
      currentChallenge: {
        id: 'hs',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25'],
        correctAnswer: '0.5',
      },
    };
    expect(getAIAnswer(pin, 'player2', 'hard')).toBeNull();
  });
});
