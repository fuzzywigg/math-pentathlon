import { describe, it, expect } from 'vitest';
import {
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
  deselectChip,
  canMove,
  forceChip,
} from '../../src/games/fiar/rules';
import { placeToMovement, forgeMovementState } from './fiar-test-helpers';

describe('FIAR – createInitialState', () => {
  it('starts in placement with empty chips and player1', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(state.currentPlayer).toBe('player1');
    expect(state.chipsPlaced).toEqual({ player1: 0, player2: 0 });
    expect(state.chipInventory.player1).toEqual({ plain: 5, marked: 2 });
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

  it('transitions to movement after 14 chips (7 each)', () => {
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.chipsPlaced.player2).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.moveHistory).toHaveLength(14);
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
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    expect(state.currentPlayer).toBe('player1');

    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);

    const pick = selectable[0];
    const selected = selectChip(state, pick);
    expect(selected.selectedNode).toBe(pick);

    const deselected = selectChip(selected, pick);
    expect(deselected.selectedNode).toBeNull();
  });

  it('selectChip rejects opponent or non-selectable nodes', () => {
    const state = placeToMovement();
    const opp = [...state.board.nodes.entries()].find(
      ([, n]) => n.chip === 'player2'
    )![0];
    expect(selectChip(state, opp)).toBe(state);
    expect(selectChip(state, 'missing')).toBe(state);
  });

  it('scripts a 4-in-a-row win via move completing a gapped line', () => {
    let state = forgeMovementState([
      { nodeId: '0-0', player: 'player1' },
      { nodeId: '0-1', player: 'player1' },
      { nodeId: '0-2', player: 'player1' },
      { nodeId: '1-4', player: 'player1' },
      { nodeId: '4-0', player: 'player2' },
      { nodeId: '4-2', player: 'player2' },
      { nodeId: '4-4', player: 'player2' },
    ]);
    expect(checkWinner(state)).toBeNull();
    state = moveChip(state, '1-4', '0-4');
    expect(state.board.nodes.get('0-4')?.chip).toBe('player1');
    expect(state.winner).toBe('player1');
    expect(state.phase).toBe('gameOver');
  });

  it('deselectChip clears selection', () => {
    let state = placeToMovement();
    const pick = getSelectableNodes(state)[0];
    state = selectChip(state, pick);
    expect(state.selectedNode).toBe(pick);
    state = deselectChip(state);
    expect(state.selectedNode).toBeNull();
  });

  it('canMove false when blocked by intervening chip', () => {
    let state = forgeMovementState([
      { nodeId: '0-0', player: 'player1' },
      { nodeId: '0-1', player: 'player2' },
      { nodeId: '0-4', player: 'player1' },
    ]);
    expect(canMove(state, '0-0', '0-4')).toBe(false);
  });

  it('isDraw false when moves exist', () => {
    const state = placeToMovement();
    expect(isDraw(state)).toBe(false);
  });

  it('forceChip sets chipKind', () => {
    let state = createInitialState();
    state = forceChip(state, '2-2', 'player1', 'marked');
    expect(state.board.nodes.get('2-2')?.chipKind).toBe('marked');
  });
});
