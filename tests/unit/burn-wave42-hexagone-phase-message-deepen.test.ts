/**
 * Wave 42 leftovers D — hexagone phase message matrix deepen. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  getPhaseMessage,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — getPhaseMessage deepen', () => {
  it('selectBlocks empty vs selected count messaging', () => {
    let state = createInitialState();
    expect(getPhaseMessage(state)).toContain('Select 1-3');
    state = selectBlock(state, 'triangle');
    expect(getPhaseMessage(state)).toContain('1 block');
    state = selectBlock(state, 'hexagon');
    expect(getPhaseMessage(state)).toContain('2 block');
  });

  it('placeBlocks remaining and gameOver winner names', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    expect(getPhaseMessage(state)).toContain('Place your blocks');
    expect(getPhaseMessage(state)).toContain('1 remaining');

    const p1Win = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getPhaseMessage(p1Win)).toBe('Blue wins!');
    const p2Win = { ...p1Win, winner: 'player2' as const };
    expect(getPhaseMessage(p2Win)).toBe('Red wins!');
  });
});
