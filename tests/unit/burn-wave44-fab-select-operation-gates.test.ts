/**
 * Wave 44 overnight HEAVY — Fab selectOperation phase gates.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — selectOperation gates', () => {
  it('wrong phase identity; happy path confirmingMove', () => {
    const s = createInitialState();
    expect(selectOperation(s, 'add')).toBe(s);
    const [a, b] = [...s.fractionBars.keys()];
    const mid = selectBar2(selectBar1(s, a), b);
    const next = selectOperation(mid, 'multiply');
    expect(next.selectedOperation).toBe('multiply');
    expect(next.phase).toBe('confirmingMove');
  });

  it('missing selected bars identity', () => {
    const s = createInitialState();
    const ghost = { ...s, phase: 'selectingOperation' as const, selectedBar1: null, selectedBar2: 'x' };
    expect(selectOperation(ghost, 'add')).toBe(ghost);
  });
});
