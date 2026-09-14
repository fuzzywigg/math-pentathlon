/**
 * Wave 42 leftovers D — stars corner adjacency valids. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import type { AttributeCard, StarsState } from '../../src/games/stars-bars/types';
import {
  createInitialState,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 42 stars — corner adjacency valids', () => {
  it('seed only (0,0) → valids are the 3 neighborhood cells', () => {
    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[0][0] = {
      ...cells[0][0],
      card: card({ id: 'corner' }),
      owner: 'player1',
    };

    const state: StarsState = { ...base, cells };
    const valids = getValidPlacements(state);
    expect(valids).toHaveLength(3);
    expect(valids).toEqual(
      expect.arrayContaining([
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ])
    );
  });
});
