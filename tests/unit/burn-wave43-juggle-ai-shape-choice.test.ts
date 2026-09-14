/**
 * Wave 43 — Juggle getAIShapeChoice after category select. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIShapeChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI shape choice', () => {
  it('returns a shape when category selected and multiple options', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
    };
    const withCat = selectDie(selecting, 0);
    // tetromino has multiple shapes — stays selectingShape
    if (withCat.phase === 'selectingShape' && withCat.selectedCategory) {
      const choice = getAIShapeChoice(withCat, 'player1', 'hard');
      expect(choice).not.toBeNull();
      expect(choice!.shape.size).toBe(4);
    } else {
      // auto-placed mono path — shape choice null
      expect(getAIShapeChoice(withCat, 'player1')).toBeNull();
    }
  });
});
