/**
 * Wave 40 — Kwatro-Sinko selectChip zero-moves / wrong owner / phase.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  getValidMoves,
  moveChip,
  isValidMove,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 40 kwatro — select / move rejects', () => {
  it('selectChip wrong owner / ghost / wrong phase → identity', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);
    expect(selectChip(state, 'ghost')).toBe(state);
    const wrongPhase = { ...state, phase: 'selectingDest' as const };
    expect(selectChip(wrongPhase, 'p1-0')).toBe(wrongPhase);
  });

  it('selectChip identity when chip has zero valid moves', () => {
    const state = createInitialState();
    const chipId = 'p1-0';
    const chip = state.chips.get(chipId)!;
    const pos = chip.position!;
    const node = state.nodes.get(pos)!;

    // Fill all connected nodes with chips
    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    for (const connId of node.connections) {
      const conn = nodes.get(connId)!;
      if (!conn.chip) {
        const blocker = {
          id: `block-${connId}`,
          value: 99,
          owner: 'player2' as const,
          position: connId,
        };
        chips.set(blocker.id, blocker);
        nodes.set(connId, { ...conn, chip: blocker });
      }
    }
    const jammed = { ...state, nodes, chips };
    expect(getValidMoves(jammed, chipId)).toHaveLength(0);
    expect(selectChip(jammed, chipId)).toBe(jammed);
  });

  it('moveChip wrong phase / ghost dest; clearSelection resets', () => {
    const state = createInitialState();
    expect(moveChip(state, 'n1-0')).toBe(state);
    expect(isValidMove(state, 'p1-0', 'ghost-node')).toBe(false);

    const selected = selectChip(state, 'p1-0');
    if (selected !== state) {
      const cleared = clearSelection(selected);
      expect(cleared.selectedChip).toBeNull();
      expect(cleared.phase).toBe('selectingChip');
      expect(moveChip(selected, 'nope')).toBe(selected);
    }
  });
});
