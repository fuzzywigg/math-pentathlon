/**
 * Wave 48 — Juggle getAIShapeChoice null gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIShapeChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — shape choice null', () => {
  it('null without category / wrong phase / wrong seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIShapeChoice(s, 'player1')).toBeNull();
    const selecting = {
      ...s,
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: null,
    };
    expect(getAIShapeChoice(selecting, 'player1')).toBeNull();
    expect(
      getAIShapeChoice(
        { ...selecting, selectedCategory: 'tetromino' as const },
        'player2'
      )
    ).toBeNull();
  });
});
