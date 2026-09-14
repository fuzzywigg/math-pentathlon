/**
 * Wave 44 — Fab-a-Diffy selectOperation wrong-phase matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, GamePhase } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — selectOperation wrong phase matrix', () => {
  const blocked: GamePhase[] = [
    'selectingBar1',
    'selectingBar2',
    'confirmingMove',
    'gameOver',
  ];

  it.each(blocked)('identity when phase is %s', (phase) => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const stuck: FabADiffyState = {
      ...state,
      phase,
      selectedBar1: ids[0],
      selectedBar2: ids[1],
      selectedOperation: phase === 'confirmingMove' ? 'add' : null,
      winner: phase === 'gameOver' ? 'player1' : null,
    };
    expect(selectOperation(stuck, 'multiply')).toBe(stuck);
  });

  it('only selectingOperation advances to confirmingMove', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    expect(mid.phase).toBe('selectingOperation');
    const next = selectOperation(mid, 'divide');
    expect(next.phase).toBe('confirmingMove');
    expect(next.selectedOperation).toBe('divide');
    // re-selecting op from confirming is identity
    expect(selectOperation(next, 'add')).toBe(next);
  });

  it('null selectedBar2 despite selectingOperation → identity', () => {
    const state = createInitialState();
    const ghost: FabADiffyState = {
      ...state,
      phase: 'selectingOperation',
      selectedBar1: [...state.fractionBars.keys()][0],
      selectedBar2: null,
    };
    expect(selectOperation(ghost, 'add')).toBe(ghost);
  });
});
