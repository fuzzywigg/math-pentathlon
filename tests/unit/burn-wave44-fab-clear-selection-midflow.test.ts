/**
 * Wave 44 overnight HEAVY — Fab clearSelection resets mid-flow.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  clearSelection,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — clearSelection', () => {
  it('resets from selectingOperation and confirmingMove', () => {
    const s = createInitialState();
    const [a, b] = [...s.fractionBars.keys()];
    const ops = selectOperation(selectBar2(selectBar1(s, a), b), 'add');
    expect(ops.phase).toBe('confirmingMove');
    const cleared = clearSelection(ops);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
    expect(cleared.selectedOperation).toBeNull();
  });
});
