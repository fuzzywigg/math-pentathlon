/**
 * Wave 44 overnight HEAVY — selectOperation when bar ids missing from map.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectOperation } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — selectOperation missing map', () => {
  it('returns identity when selected ids absent', () => {
    const s = createInitialState();
    const ghost = {
      ...s,
      phase: 'selectingOperation' as const,
      selectedBar1: 'ghost-1',
      selectedBar2: 'ghost-2',
    };
    expect(selectOperation(ghost, 'add')).toBe(ghost);
  });
});
