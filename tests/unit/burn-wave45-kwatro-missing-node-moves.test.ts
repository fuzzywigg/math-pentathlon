/**
 * Wave 45 TOKENMAXX — Kwatro getValidMoves missing node leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — missing node', () => {
  it('getValidMoves [] when chip.position set but nodes map missing entry', () => {
    const open = createInitialState();
    const nodes = new Map(open.nodes);
    const chip = open.chips.get('p1-0')!;
    nodes.delete(chip.position!);
    const forged = { ...open, nodes };
    expect(getValidMoves(forged, 'p1-0')).toEqual([]);
  });
});
