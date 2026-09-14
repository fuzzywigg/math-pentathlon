/**
 * Overnight TOKENMAXX — FIAR findPaths below WIN_LENGTH leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, findPaths } from '../../src/games/fiar/rules';

describe('Overnight fiar — findPaths short', () => {
  it('three aligned chips yield no win-length path', () => {
    let s = createInitialState();
    s = placeChip(s, '0-0'); // p1
    s = placeChip(s, '4-0'); // p2
    s = placeChip(s, '0-1'); // p1
    s = placeChip(s, '4-1'); // p2
    s = placeChip(s, '0-2'); // p1
    const paths = findPaths(s, 'player1');
    expect(paths.every((p) => p.nodes.length < 4)).toBe(true);
  });
});
