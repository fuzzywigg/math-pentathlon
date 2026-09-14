/**
 * Wave 43 — single pass flips seat leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  passTurn,
} from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 sd — single pass flips', () => {
  it('one pass → seat flip, passCount=1, phase rolling (not settle)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    let s = createInitialState();
    s = doRollDice(s);
    // Force passing phase
    s = { ...s, phase: 'passing' };
    const next = passTurn(s);
    expect(next.passCount).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });
});
