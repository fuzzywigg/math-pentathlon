/**
 * Wave 40 — Kwatro Sinko selectChip owner/phase/position reject matrix.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  clearSelection,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 40 kwatro — selectChip rejects', () => {
  it('rejects wrong phase and ghost chip id (identity)', () => {
    const state = createInitialState();
    const dest = { ...state, phase: 'selectingDest' as const };
    expect(selectChip(dest, 'ghost')).toBe(dest);
    expect(selectChip(state, 'no-such-chip')).toBe(state);
  });

  it('rejects opponent-owned chip', () => {
    const state = createInitialState();
    const opp = [...state.chips.values()].find(
      (c) => c.owner === 'player2' && c.position
    );
    expect(opp).toBeTruthy();
    expect(selectChip(state, opp!.id)).toBe(state);
  });

  it('rejects chip with null position', () => {
    const state = createInitialState();
    const own = [...state.chips.values()].find(
      (c) => c.owner === 'player1' && c.position
    )!;
    const chips = new Map(state.chips);
    chips.set(own.id, { ...own, position: null });
    const haunted = { ...state, chips };
    expect(selectChip(haunted, own.id)).toBe(haunted);
  });

  it('rejects when getValidMoves empty; clearSelection resets phase', () => {
    const state = createInitialState();
    const own = [...state.chips.values()].find(
      (c) => c.owner === 'player1' && c.position
    )!;
    // Fill all neighbor nodes so moves empty
    const nodes = new Map(state.nodes);
    const cur = nodes.get(own.position!)!;
    for (const connId of cur.connections) {
      const n = nodes.get(connId)!;
      nodes.set(connId, {
        ...n,
        chip: { id: 'block', value: 1, owner: 'player2', position: connId },
      });
    }
    const jammed = { ...state, nodes };
    expect(getValidMoves(jammed, own.id)).toHaveLength(0);
    expect(selectChip(jammed, own.id)).toBe(jammed);

    const selected = {
      ...state,
      selectedChip: own.id,
      phase: 'selectingDest' as const,
    };
    const cleared = clearSelection(selected);
    expect(cleared.selectedChip).toBeNull();
    expect(cleared.phase).toBe('selectingChip');
  });
});
