/**
 * Wave 42 — handshake: stars countDifferences × remainder countOwned.
 * Pure tally engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  countDifferences,
  type AttributeCard,
} from '../../src/games/stars-bars/types';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { countOwnedIslands } from '../../src/games/remainder-islands/rules';

describe('Wave 42 handshake — stars diffs × rem owned', () => {
  it('zero diffs ↔ zero owned on fresh boards', () => {
    const a: AttributeCard = {
      id: '1',
      shape: 'triangle',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    };
    const b = { ...a, id: '2' };
    expect(countDifferences(a, b)).toBe(0);
    expect(countOwnedIslands(createInitialState())).toEqual({
      player1: 0,
      player2: 0,
    });
  });

  it('partial diffs and partial ownership both count linearly', () => {
    const a: AttributeCard = {
      id: '1',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const b: AttributeCard = {
      ...a,
      id: '2',
      shape: 'square',
      size: 'large',
    };
    expect(countDifferences(a, b)).toBe(2);

    const state = createInitialState();
    const islands = state.islands.map((island, idx) =>
      idx < 3 ? { ...island, owner: 'player1' as const } : island
    );
    expect(countOwnedIslands({ ...state, islands }).player1).toBe(3);
  });
});
