/**
 * Targeted branch coverage for fiar/rules.ts + types spacing fallback —
 * hand-built / forged states only. Inventory edges, illegal place/move,
 * win-path corners, turn handoff. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getBoardDirections,
  getDirections,
  type ChipKind,
  type FiarGameState,
} from '../../src/games/fiar/types';
import {
  placeChip,
  canPlaceChip,
  setSelectedChipKind,
  normalizeSelectedChipKind,
  moveChip,
  selectChip,
  deselectChip,
  getValidMoves,
  getSelectableNodes,
  findPaths,
  forceChip,
  isDraw,
  checkWinner,
} from '../../src/games/fiar/rules';
import { placeToMovement } from './fiar-test-helpers';

describe('FIAR targeted — inventory + illegal rejection', () => {
  it('setSelectedChipKind rejects exhausted plain/marked kinds', () => {
    let state = createInitialState();
    state = {
      ...state,
      chipInventory: {
        player1: { plain: 0, marked: 2 },
        player2: { plain: 5, marked: 2 },
      },
      selectedChipKind: 'marked',
    };
    expect(setSelectedChipKind(state, 'plain')).toBe(state);

    state = {
      ...state,
      chipInventory: {
        player1: { plain: 3, marked: 0 },
        player2: state.chipInventory.player2,
      },
      selectedChipKind: 'plain',
    };
    expect(setSelectedChipKind(state, 'marked')).toBe(state);
  });

  it('normalizeSelectedChipKind falls back to plain when marked is empty', () => {
    const state: FiarGameState = {
      ...createInitialState(),
      selectedChipKind: 'marked',
      chipInventory: {
        player1: { plain: 2, marked: 0 },
        player2: { plain: 5, marked: 2 },
      },
    };
    const normalized = normalizeSelectedChipKind(state);
    expect(normalized.selectedChipKind).toBe('plain');
    expect(normalized).not.toBe(state);
  });

  it('placeChip with non plain/marked kind argument uses selectedChipKind', () => {
    const state = createInitialState();
    const next = placeChip(
      state,
      'c0r3',
      'bogus' as unknown as ChipKind
    );
    expect(next.board.nodes.get('c0r3')?.chip).toBe('player1');
    expect(next.board.nodes.get('c0r3')?.chipKind).toBe('plain');
    expect(next.currentPlayer).toBe('player2'); // turn handoff
  });

  it('forceChip throws on missing node id', () => {
    expect(() =>
      forceChip(createInitialState(), 'no-such-node', 'player1')
    ).toThrow(/missing/);
  });

  it('placement rejects occupied / missing / wrong-phase nodes', () => {
    let state = placeChip(createInitialState(), 'c0r3');
    expect(canPlaceChip(state, 'c0r3')).toBe(false);
    expect(placeChip(state, 'c0r3')).toBe(state);
    expect(canPlaceChip(state, 'missing')).toBe(false);

    const movement = placeToMovement();
    expect(movement.phase).toBe('movement');
    expect(canPlaceChip(movement, 'c2r2')).toBe(false);
    expect(placeChip(movement, 'c2r2')).toBe(movement);
  });
});

describe('FIAR targeted — movement edges, win corners, handoff', () => {
  it('edge-column chip only offers destinations that exist on the board', () => {
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    const edgeOwned = [...state.board.nodes.entries()].find(
      ([id, n]) => n.chip === state.currentPlayer && /^c0r/.test(id)
    );
    const from = edgeOwned?.[0] ?? getSelectableNodes(state)[0]!;
    const moves = getValidMoves(state, from);
    for (const id of moves) {
      expect(state.board.nodes.has(id)).toBe(true);
      expect(state.board.nodes.get(id)?.chip).toBeNull();
    }
    expect(getBoardDirections(state.board).length).toBe(8);
  });

  it('getBoardDirections falls back when spacing is falsy', () => {
    const state = createInitialState();
    const dirs = getBoardDirections({ ...state.board, spacing: 0 });
    expect(dirs).toEqual(getDirections(80));
  });

  it('findPaths skips missing node ids injected into straightLinesCache', () => {
    let state = createInitialState();
    state = {
      ...state,
      board: {
        ...state.board,
        straightLinesCache: [
          ['ghost-a', 'ghost-b', 'ghost-c', 'ghost-d', 'ghost-e'],
        ],
      },
    };
    expect(findPaths(state, 'player1')).toEqual([]);
  });

  it('select / deselect / illegal move + turn handoff on legal move', () => {
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    const pick = selectable[0]!;
    const selected = selectChip(state, pick);
    expect(selected.selectedNode).toBe(pick);
    expect(deselectChip(selected).selectedNode).toBeNull();

    const dests = getValidMoves(selected, pick);
    expect(dests.length).toBeGreaterThan(0);
    expect(moveChip(selected, pick, 'no-dest')).toBe(selected);

    const after = moveChip(selected, pick, dests[0]!);
    if (after.phase === 'gameOver') {
      expect(after.winner).not.toBeNull();
    } else {
      expect(after.currentPlayer).toBe('player2');
      expect(after.selectedNode).toBeNull();
    }
    expect(isDraw(state)).toBe(false);
    expect(checkWinner(createInitialState())).toBeNull();
  });
});
