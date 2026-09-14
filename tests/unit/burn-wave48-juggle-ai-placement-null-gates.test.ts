/**
 * Wave 48 — Juggle getAIPlacement null gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — placement null gates', () => {
  it('null when not placing / wrong seat / missing shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIPlacement(s, 'player1')).toBeNull();
    const selecting = { ...s, phase: 'selectingShape' as const, currentDice: [1, 1] as [number, number] };
    expect(getAIPlacement(selecting, 'player1')).toBeNull();
    const placing = selectDie(selecting, 0);
    expect(placing.phase).toBe('placing');
    expect(getAIPlacement(placing, 'player2')).toBeNull();
    expect(getAIPlacement({ ...placing, selectedShape: null }, 'player1')).toBeNull();
  });
});
