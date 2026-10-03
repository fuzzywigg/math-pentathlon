import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
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
    expect(state.board.nodes.size).toBe(40);
  });
});

describe('FIAR – placement', () => {
  it('canPlaceChip is true on empty nodes during placement', () => {
    const state = createInitialState();
    expect(canPlaceChip(state, 'c0r3')).toBe(true);
    expect(canPlaceChip(state, 'c4r2')).toBe(true);
    expect(canPlaceChip(state, 'c4r3')).toBe(false); // yellow center — not a space
  });

  it('places chips alternating players', () => {
    let state = createInitialState();
    state = placeChip(state, 'c0r3');
    expect(state.board.nodes.get('c0r3')?.chip).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.chipsPlaced.player1).toBe(1);

    state = placeChip(state, 'c8r3');
    expect(state.board.nodes.get('c8r3')?.chip).toBe('player2');
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
    let state = placeChip(createInitialState(), 'c0r3');
    expect(canPlaceChip(state, 'c0r3')).toBe(false);
    const before = state;
    expect(placeChip(state, 'c0r3')).toBe(before);
  });

  it('illegal place returns same ref', () => {
    const state = createInitialState();
    expect(placeChip(state, 'no-such-node')).toBe(state);
    expect(placeChip(state, 'c4r3')).toBe(state);
  });
});

describe('FIAR – movement / win', () => {
  it('selectChip toggles selected node for movable chips', () => {
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    expect(state.currentPlayer).toBe('player1');

    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);

    const pick = selectable[0]!;
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
      { nodeId: 'c0r3', player: 'player1' },
      { nodeId: 'c1r3', player: 'player1' },
      { nodeId: 'c2r3', player: 'player1' },
      { nodeId: 'c1r1', player: 'player1' },
      { nodeId: 'c5r3', player: 'player2' },
      { nodeId: 'c6r3', player: 'player2' },
      { nodeId: 'c7r3', player: 'player2' },
    ]);
    expect(checkWinner(state)).toBeNull();
    state = moveChip(state, 'c1r1', 'c3r3');
    expect(state.board.nodes.get('c3r3')?.chip).toBe('player1');
    expect(state.winner).toBe('player1');
    expect(state.phase).toBe('gameOver');
  });

  it('deselectChip clears selection', () => {
    let state = placeToMovement();
    const pick = getSelectableNodes(state)[0]!;
    state = selectChip(state, pick);
    expect(state.selectedNode).toBe(pick);
    state = deselectChip(state);
    expect(state.selectedNode).toBeNull();
  });

  it('canMove false when blocked by intervening chip', () => {
    let state = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1' },
      { nodeId: 'c2r2', player: 'player2' },
      { nodeId: 'c5r2', player: 'player1' },
    ]);
    expect(canMove(state, 'c1r2', 'c5r2')).toBe(false);
  });

  it('isDraw false when moves exist', () => {
    const state = placeToMovement();
    expect(isDraw(state)).toBe(false);
  });

  it('forceChip sets chipKind', () => {
    let state = createInitialState();
    state = forceChip(state, 'c4r2', 'player1', 'marked');
    expect(state.board.nodes.get('c4r2')?.chipKind).toBe('marked');
  });
});
