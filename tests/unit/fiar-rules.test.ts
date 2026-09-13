import { describe, it, expect } from 'vitest';
import {
  FiarGameState,
  createInitialState,
  CONFIG,
} from '../../src/games/fiar/types';
import {
  placeChip,
  canPlaceChip,
  checkWinner,
  moveChip,
  selectChip,
  isDraw,
  getSelectableNodes,
} from '../../src/games/fiar/rules';

function placeMany(state: FiarGameState, nodeIds: string[]): FiarGameState {
  let s = state;
  for (const id of nodeIds) {
    s = placeChip(s, id);
  }
  return s;
}

describe('FIAR – createInitialState', () => {
  it('starts in placement with empty chips and player1', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(state.currentPlayer).toBe('player1');
    expect(state.chipsPlaced).toEqual({ player1: 0, player2: 0 });
    expect(state.winner).toBeNull();
    expect(state.selectedNode).toBeNull();
    expect(state.board.nodes.size).toBe(25);
  });
});

describe('FIAR – placement', () => {
  it('canPlaceChip is true on empty nodes during placement', () => {
    const state = createInitialState();
    expect(canPlaceChip(state, '0-0')).toBe(true);
    expect(canPlaceChip(state, '2-2')).toBe(true);
  });

  it('places chips alternating players', () => {
    let state = createInitialState();
    state = placeChip(state, '0-0');
    expect(state.board.nodes.get('0-0')?.chip).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.chipsPlaced.player1).toBe(1);

    state = placeChip(state, '4-4');
    expect(state.board.nodes.get('4-4')?.chip).toBe('player2');
    expect(state.currentPlayer).toBe('player1');
    expect(state.chipsPlaced.player2).toBe(1);
  });

  it('transitions to movement after 8 chips (4 each)', () => {
    const nodes = [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ];
    const state = placeMany(createInitialState(), nodes);
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.chipsPlaced.player2).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.moveHistory).toHaveLength(8);
  });

  it('cannot place on occupied node', () => {
    let state = placeChip(createInitialState(), '0-0');
    expect(canPlaceChip(state, '0-0')).toBe(false);
    const before = state;
    expect(placeChip(state, '0-0')).toBe(before);
  });

  it('illegal place returns same ref', () => {
    const state = createInitialState();
    expect(placeChip(state, 'no-such-node')).toBe(state);
    expect(placeChip(state, '99-99')).toBe(state);
  });
});

describe('FIAR – movement / win', () => {
  it('selectChip toggles selected node for movable chips', () => {
    const state = placeMany(createInitialState(), [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ]);
    expect(state.phase).toBe('movement');
    expect(state.currentPlayer).toBe('player1');

    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    expect(selectable).toContain('0-4');

    const selected = selectChip(state, '0-4');
    expect(selected.selectedNode).toBe('0-4');

    const deselected = selectChip(selected, '0-4');
    expect(deselected.selectedNode).toBeNull();
  });

  it('selectChip rejects opponent or non-selectable nodes', () => {
    const state = placeMany(createInitialState(), [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ]);
    expect(selectChip(state, '4-4')).toBe(state);
    expect(selectChip(state, 'missing')).toBe(state);
  });

  it('scripts a 4-in-a-row win via place then move', () => {
    // P1: 0-0,0-1,0-2,0-4 — leave 0-3 open. P2 scattered so no 4-in-a-row.
    let state = placeMany(createInitialState(), [
      '0-0',
      '4-0',
      '0-1',
      '4-2',
      '0-2',
      '4-4',
      '0-4',
      '3-4',
    ]);
    expect(state.phase).toBe('movement');
    expect(checkWinner(state)).toBeNull();

    state = moveChip(state, '0-4', '0-3');
    expect(state.board.nodes.get('0-3')?.chip).toBe('player1');
    expect(state.board.nodes.get('0-4')?.chip).toBeNull();
    expect(checkWinner(state)).toBe('player1');
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('illegal move returns same ref', () => {
    const state = placeMany(createInitialState(), [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ]);
    expect(moveChip(state, '0-0', '0-0')).toBe(state);
    expect(moveChip(state, '0-4', '4-4')).toBe(state);
  });

  it('isDraw is false when selectable moves exist', () => {
    const state = placeMany(createInitialState(), [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ]);
    expect(isDraw(state)).toBe(false);
  });

  it('isDraw is false outside movement phase', () => {
    expect(isDraw(createInitialState())).toBe(false);
  });

  it('getSelectableNodes is empty during placement', () => {
    expect(getSelectableNodes(createInitialState())).toEqual([]);
  });
});
