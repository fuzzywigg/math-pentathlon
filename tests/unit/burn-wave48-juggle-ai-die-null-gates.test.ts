/**
 * Wave 48 — Juggle getAIDieChoice null gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — die choice null gates', () => {
  it('null wrong phase / wrong seat / already selected / no dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const base = createInitialState();
    expect(getAIDieChoice(base, 'player1')).toBeNull(); // rolling
    const selecting = { ...base, phase: 'selectingShape' as const, currentDice: [3, 5] as [number, number] };
    expect(getAIDieChoice(selecting, 'player2')).toBeNull();
    expect(getAIDieChoice({ ...selecting, currentDice: null }, 'player1')).toBeNull();
    const withCat = selectDie(selecting, 0);
    expect(getAIDieChoice(withCat, 'player1')).toBeNull();
  });
});
