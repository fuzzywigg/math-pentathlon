import { describe, it, expect } from 'vitest';
import {
  isWinningValue,
  type Chip,
  type KwaMove,
  type KwaState,
} from '../../src/games/kwatro-sinko/types';
import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  clearSelection,
  isValidMove,
  hasValidMoves,
  passTurn,
  formatMove,
} from '../../src/games/kwatro-sinko/rules';

/** Mutate chip placement on both chips map and nodes map. */
function putChip(state: KwaState, chipId: string, nodeId: string): void {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);
  if (chip.position) {
    const old = state.nodes.get(chip.position);
    if (old) state.nodes.set(chip.position, { ...old, chip: null });
  }
  const updated: Chip = { ...chip, position: nodeId };
  state.chips.set(chipId, updated);
  const node = state.nodes.get(nodeId);
  if (!node) throw new Error(`missing node ${nodeId}`);
  state.nodes.set(nodeId, { ...node, chip: updated });
}

describe('Kwatro-Sinko – isWinningValue', () => {
  it('accepts 4 and 5 only', () => {
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);
    expect(isWinningValue(6)).toBe(false);
  });
});

describe('Kwatro-Sinko – selectChip / getValidMoves / moveChip', () => {
  it('selectChip selects an own chip with empty destinations', () => {
    const state = createInitialState();
    // Corner chips on top row connect into the open middle
    const chipId = 'p1-0';
    const moves = getValidMoves(state, chipId);
    expect(moves.length).toBeGreaterThan(0);

    const selected = selectChip(state, chipId);
    expect(selected.selectedChip).toBe(chipId);
    expect(selected.phase).toBe('selectingDest');
  });

  it('selectChip rejects opponent chips', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);
  });

  it('moveChip relocates the chip and clears selection', () => {
    const state = createInitialState();
    const chipId = 'p1-2';
    const destinations = getValidMoves(state, chipId);
    expect(destinations.length).toBeGreaterThan(0);

    let next = selectChip(state, chipId);
    const dest = destinations[0];
    next = moveChip(next, dest);

    expect(next.chips.get(chipId)?.position).toBe(dest);
    expect(next.nodes.get(dest)?.chip?.id).toBe(chipId);
    expect(next.nodes.get('n0-2')?.chip).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('selectingChip');
      expect(next.selectedChip).toBeNull();
    }
  });

  it('illegal occupied destination is a no-op', () => {
    const state = createInitialState();
    // All top-row nodes start occupied by p1 chips
    let next = selectChip(state, 'p1-0');
    const before = next;
    next = moveChip(next, 'n0-1'); // occupied by p1-1
    expect(next).toBe(before);
    expect(next.chips.get('p1-0')?.position).toBe('n0-0');
  });

  it('clearSelection returns to selectingChip', () => {
    const state = selectChip(createInitialState(), 'p1-0');
    const cleared = clearSelection(state);
    expect(cleared.selectedChip).toBeNull();
    expect(cleared.phase).toBe('selectingChip');
  });
});

describe('Kwatro-Sinko – isValidMove / hasValidMoves / passTurn / formatMove', () => {
  it('isValidMove is true for a legal destination and false for disconnected', () => {
    const state = createInitialState();
    const chipId = 'p1-2';
    const legal = getValidMoves(state, chipId);
    expect(legal.length).toBeGreaterThan(0);
    expect(isValidMove(state, chipId, legal[0])).toBe(true);
    // Opposite corner is not a one-step connection from n0-2
    expect(isValidMove(state, chipId, 'n4-4')).toBe(false);
  });

  it('hasValidMoves is true on a fresh board', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
  });

  it('passTurn flips the seat and clears selection', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    const next = passTurn(selected);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedChip).toBeNull();
    expect(next.phase).toBe('selectingChip');
  });

  it('formatMove includes alignment expression when present', () => {
    const chip: Chip = {
      id: 'p1-2',
      value: 4,
      owner: 'player1',
      position: 'n2-2',
    };
    const bare: KwaMove = {
      player: 'player1',
      chip,
      fromNode: 'n1-2',
      toNode: 'n2-2',
      alignment: null,
      moveNumber: 1,
    };
    expect(formatMove(bare)).toBe('Chip 4');

    const withAlign: KwaMove = {
      ...bare,
      alignment: {
        nodes: ['n2-0', 'n2-1', 'n2-2'],
        chips: [chip],
        expression: '0 + 8 - 4 = 4',
        result: 4,
      },
    };
    expect(formatMove(withAlign)).toBe('Chip 4 (0 + 8 - 4 = 4)');
  });
});

describe('Kwatro-Sinko – win paths', () => {
  it('alignment win: three chips form a+b-c = 4 after moveChip', () => {
    const state = createInitialState();
    // Clear start rows so crafted mid-board line is free
    for (const id of [...state.chips.keys()]) {
      const chip = state.chips.get(id)!;
      if (chip.position) {
        const node = state.nodes.get(chip.position)!;
        state.nodes.set(chip.position, { ...node, chip: null });
        state.chips.set(id, { ...chip, position: null });
      }
    }
    // p1 values: 0,2,4,6,8 → 0 + 8 - 4 = 4 on horizontal n2-0,n2-1,n2-2
    putChip(state, 'p1-0', 'n2-0'); // 0
    putChip(state, 'p1-4', 'n2-1'); // 8
    putChip(state, 'p1-2', 'n1-2'); // 4 — will slide into n2-2
    putChip(state, 'p1-1', 'n3-0'); // 2
    putChip(state, 'p1-3', 'n3-4'); // 6
    putChip(state, 'p2-0', 'n4-0');
    putChip(state, 'p2-1', 'n4-1');
    putChip(state, 'p2-2', 'n4-2');
    putChip(state, 'p2-3', 'n4-3');
    putChip(state, 'p2-4', 'n4-4');

    expect(isValidMove(state, 'p1-2', 'n2-2')).toBe(true);
    let next = selectChip(state, 'p1-2');
    next = moveChip(next, 'n2-2');

    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.winningAlignment).not.toBeNull();
    expect(next.winningAlignment!.result).toBe(4);
    expect(isWinningValue(next.winningAlignment!.result)).toBe(true);
  });

  it('alternative win: all own chips on non-numbered spaces', () => {
    const state = createInitialState();
    for (const id of [...state.chips.keys()]) {
      const chip = state.chips.get(id)!;
      if (chip.position) {
        const node = state.nodes.get(chip.position)!;
        state.nodes.set(chip.position, { ...node, chip: null });
        state.chips.set(id, { ...chip, position: null });
      }
    }
    // Rows 1–3 are non-numbered; leave one chip on numbered n0-2 to move inward
    putChip(state, 'p1-0', 'n1-0');
    putChip(state, 'p1-1', 'n1-1');
    putChip(state, 'p1-3', 'n1-3');
    putChip(state, 'p1-4', 'n1-4');
    putChip(state, 'p1-2', 'n0-2'); // numbered → move to n1-2
    putChip(state, 'p2-0', 'n4-0');
    putChip(state, 'p2-1', 'n4-1');
    putChip(state, 'p2-2', 'n4-2');
    putChip(state, 'p2-3', 'n4-3');
    putChip(state, 'p2-4', 'n4-4');

    expect(state.nodes.get('n1-2')!.isNumbered).toBe(false);
    let next = selectChip(state, 'p1-2');
    next = moveChip(next, 'n1-2');

    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    const p1 = [...next.chips.values()].filter((c) => c.owner === 'player1');
    expect(
      p1.every((c) => c.position && !next.nodes.get(c.position)!.isNumbered)
    ).toBe(true);
  });
});
