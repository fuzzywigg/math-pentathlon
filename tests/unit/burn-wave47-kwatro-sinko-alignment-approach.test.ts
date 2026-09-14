/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko alignment-approach move sequences leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  isValidMove,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function placeChipAt(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing ${chipId}`);
  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);

  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }
  const target = nodes.get(nodeId);
  if (!target) throw new Error(`missing node ${nodeId}`);
  if (target.chip) throw new Error(`occupied ${nodeId}`);

  const updated: Chip = { ...chip, position: nodeId };
  nodes.set(nodeId, { ...target, chip: updated });
  chips.set(chipId, updated);
  return { ...state, nodes, chips };
}

describe('Wave 47 kwatro deepen 6 — kwatro — deep alignment approach + illegal reject', () => {
  it('multi-step moves toward center keep rejecting occupied destinations', () => {
    let state = createInitialState();

    // Move p1-0 down toward center: n0-0 → n1-0 → n2-0
    state = selectChip(state, 'p1-0');
    expect(isValidMove(state, 'p1-0', 'n1-0')).toBe(true);
    state = moveChip(state, 'n1-0');
    expect(state.chips.get('p1-0')!.position).toBe('n1-0');
    expect(state.currentPlayer).toBe('player2');

    // Opponent mirrors from bottom
    state = selectChip(state, 'p2-0');
    state = moveChip(state, getValidMoves(state, 'p2-0')[0]);
    expect(state.currentPlayer).toBe('player1');

    state = selectChip(state, 'p1-0');
    const next = getValidMoves(state, 'p1-0');
    expect(next).toContain('n2-0');
    // Still reject occupied start row and other p1 chips
    expect(isValidMove(state, 'p1-0', 'n0-1')).toBe(false);
    expect(moveChip(state, 'n0-1')).toBe(state);

    state = moveChip(state, 'n2-0');
    expect(state.chips.get('p1-0')!.position).toBe('n2-0');
  });

  it('rejects move onto an illegally occupied mid-board node after approach setup', () => {
    // Place three p1 chips approaching a horizontal line without triggering win via API
    let state = createInitialState();
    state = placeChipAt(state, 'p1-0', 'n2-1');
    state = placeChipAt(state, 'p1-1', 'n2-2');
    // Leave n2-3 empty for approach; put opponent on n2-3 to block
    state = placeChipAt(state, 'p2-0', 'n2-3');
    state = {
      ...state,
      currentPlayer: 'player1',
      phase: 'selectingChip',
      selectedChip: null,
    };

    state = selectChip(state, 'p1-2');
    // Wherever p1-2 sits, moving onto occupied n2-3 must be illegal
    expect(isValidMove(state, 'p1-2', 'n2-3')).toBe(false);
    expect(moveChip(state, 'n2-3')).toBe(state);

    // Moving onto empty neighbor of selected chip (if any) is fine; occupied never is
    for (const id of state.nodes.keys()) {
      if (state.nodes.get(id)?.chip) {
        expect(isValidMove(state, state.selectedChip!, id)).toBe(false);
      }
    }
  });

  it('legal hop into empty adjacent cell among near-alignment chips updates history only', () => {
    let state = createInitialState();
    // Clear mid board path: move p1-4 (value 8 at n0-4) inward
    const moves = getValidMoves(state, 'p1-4');
    expect(moves.length).toBeGreaterThan(0);
    state = selectChip(state, 'p1-4');
    const dest = moves[0];
    state = moveChip(state, dest);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].alignment === null || typeof state.moveHistory[0].alignment === 'object').toBe(
      true
    );
    // Destination must have been empty before; source now empty
    expect(state.nodes.get('n0-4')?.chip).toBeNull();
    expect(state.nodes.get(dest)?.chip?.id).toBe('p1-4');
  });
});
