/**
 * Wave 41 — Fab-a-Diffy selectOperation missing-bars identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  clearSelection,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 41 fab-a-diffy — selectOperation missing bars', () => {
  it('identity when selectedBar1/2 null despite phase', () => {
    const state = createInitialState();
    const ghost: FabADiffyState = {
      ...state,
      phase: 'selectingOperation',
      selectedBar1: null,
      selectedBar2: null,
    };
    expect(selectOperation(ghost, 'add')).toBe(ghost);
  });

  it('identity when bar ids missing from map', () => {
    const state = createInitialState();
    const ghost: FabADiffyState = {
      ...state,
      phase: 'selectingOperation',
      selectedBar1: 'gone-1',
      selectedBar2: 'gone-2',
    };
    expect(selectOperation(ghost, 'multiply')).toBe(ghost);
  });

  it('happy path then clear returns to bar1', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let next = selectBar1(state, ids[0]);
    next = selectBar2(next, ids[1]);
    expect(next.phase).toBe('selectingOperation');
    next = selectOperation(next, 'subtract');
    expect(next.selectedOperation).toBe('subtract');
    expect(next.phase).toBe('confirmingMove');
    next = clearSelection(next);
    expect(next).not.toBe(state);
    expect(next.phase).toBe('selectingBar1');
  });
});
