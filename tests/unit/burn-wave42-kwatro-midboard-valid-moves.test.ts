/**
 * Wave 42 — Kwatro-Sinko getValidMoves after forged mid-board positions. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function placeChip(
  state: KwaState,
  chipId: string,
  nodeId: string
): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);

  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);

  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }

  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (node) nodes.set(nodeId, { ...node, chip: updated });

  return { ...state, nodes, chips };
}

function forgeMidBoard(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-0', 'n2-0');
  state = placeChip(state, 'p1-1', 'n2-1');
  state = placeChip(state, 'p1-2', 'n2-2');
  state = placeChip(state, 'p1-3', 'n2-3');
  state = placeChip(state, 'p1-4', 'n2-4');
  return state;
}

describe('Wave 42 kwatro-sinko — mid-board valid moves', () => {
  it('interior chip on row 2 gains diagonal and axis moves but not occupied neighbors', () => {
    const state = forgeMidBoard();
    const moves = getValidMoves(state, 'p1-2').sort();
    expect(moves).toContain('n1-2');
    expect(moves).toContain('n3-2');
    expect(moves).toContain('n1-1');
    expect(moves).toContain('n3-3');
    expect(moves).not.toContain('n2-1');
    expect(moves).not.toContain('n2-3');
    expect(moves).toHaveLength(6);
  });

  it('edge mid-board chip cannot step off the 5x5 grid', () => {
    const state = forgeMidBoard();
    const moves = getValidMoves(state, 'p1-0');
    for (const dest of moves) {
      expect(dest).toMatch(/^n[0-4]-[0-4]$/);
    }
    expect(moves).not.toContain('n2--1');
  });

  it('occupied neighbors are excluded from valid destinations', () => {
    const state = forgeMidBoard();
    expect(getValidMoves(state, 'p1-2')).not.toContain('n2-1');
    expect(getValidMoves(state, 'p1-2')).not.toContain('n2-3');
  });

  it('center-adjacent placement exposes diagonal reach in row 1', () => {
    const state = placeChip(createInitialState(), 'p1-2', 'n1-2');
    const moves = getValidMoves(state, 'p1-2');
    expect(moves).toContain('n2-2');
    expect(moves).toContain('n2-1');
    expect(moves).toContain('n2-3');
  });
});
