/**
 * Wave 44 — Fab-a-Diffy selectBar used / gameOver leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  clearSelection,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — selectBar gameOver / used edges', () => {
  it('selectBar1/2 identity when gameOver', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const over: FabADiffyState = {
      ...state,
      phase: 'gameOver',
      winner: 'player2',
    };
    expect(selectBar1(over, ids[0])).toBe(over);
    expect(selectBar2(over, ids[1])).toBe(over);
  });

  it('selectBar2 rejects used second bar', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const bars = new Map(state.fractionBars);
    bars.set(ids[1], { ...bars.get(ids[1])!, used: true });
    let mid: FabADiffyState = { ...state, fractionBars: bars };
    mid = selectBar1(mid, ids[0]);
    expect(mid.phase).toBe('selectingBar2');
    expect(selectBar2(mid, ids[1])).toBe(mid);
  });

  it('clearSelection from gameOver still resets to selectingBar1', () => {
    const state = createInitialState();
    const over: FabADiffyState = {
      ...state,
      phase: 'gameOver',
      winner: 'player1',
      selectedBar1: 'x',
      selectedBar2: 'y',
      selectedOperation: 'add',
    };
    const cleared = clearSelection(over);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.winner).toBe('player1');
    expect(cleared.selectedBar1).toBeNull();
  });
});
