/**
 * Overnight TOKENMAXX — Fab selectBar2 same-id reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2, selectOperation } from '../../src/games/fab-a-diffy/rules';

describe('Overnight fab — select same-bar reject', () => {
  it('selectBar2 rejects same id as bar1', () => {
    let state = createInitialState();
    const id = [...state.fractionBars.keys()][0];
    state = selectBar1(state, id);
    const same = selectBar2(state, id);
    expect(same).toBe(state);
    expect(same.phase).toBe('selectingBar2');
  });

  it('selectOperation wrong phase is identity', () => {
    const state = createInitialState();
    expect(selectOperation(state, 'add')).toBe(state);
  });
});
