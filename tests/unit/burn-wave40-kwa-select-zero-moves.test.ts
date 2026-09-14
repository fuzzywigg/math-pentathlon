/**
 * Wave 40 — Kwatro-sinko selectChip zero-moves / owner / phase identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip } from '../../src/games/kwatro-sinko/types';

describe('Wave 40 kwa — selectChip zero moves / rejects', () => {
  it('selectChip identity when all connections occupied', () => {
    const state = createInitialState();
    const chipId = 'p1-0';
    const chip = state.chips.get(chipId)!;
    const node = state.nodes.get(chip.position!)!;

    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    for (const connId of node.connections) {
      const conn = nodes.get(connId)!;
      if (!conn.chip) {
        const blocker: Chip = {
          id: `block-${connId}`,
          value: 99,
          owner: 'player2',
          position: connId,
        };
        chips.set(blocker.id, blocker);
        nodes.set(connId, { ...conn, chip: blocker });
      }
    }
    const jammed = { ...state, nodes, chips };
    expect(getValidMoves(jammed, chipId)).toEqual([]);
    expect(selectChip(jammed, chipId)).toBe(jammed);
  });

  it('selectChip identity for wrong owner / missing position', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);

    const chips = new Map(state.chips);
    const orphan: Chip = {
      id: 'orphan',
      value: 0,
      owner: 'player1',
      position: null,
    };
    chips.set(orphan.id, orphan);
    const withOrphan = { ...state, chips };
    expect(selectChip(withOrphan, orphan.id)).toBe(withOrphan);
  });

  it('selectChip identity wrong phase', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingDest' as const,
      selectedChip: 'p1-0',
    };
    expect(selectChip(state, 'p1-0')).toBe(state);
  });
});
