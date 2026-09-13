import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  RamrodState,
  Rod,
  SumBox,
  createRod,
  createBoxId,
  CONFIG,
} from '../../src/games/ramrod/types';
import {
  createInitialState,
  selectRod,
  getValidPlacements,
  placeRod,
  passTurn,
  hasValidMoves,
  isValidPlacement,
} from '../../src/games/ramrod/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function controlledState(
  player1Rods: Rod[],
  boxes?: Map<string, SumBox>
): RamrodState {
  const rods = new Map<string, Rod>();
  for (const rod of player1Rods) {
    rods.set(rod.id, { ...rod, owner: 'player1' });
  }
  // Dummy opponent rod so map is non-empty
  const opp = createRod('opp-1', 2);
  opp.owner = 'player2';
  rods.set(opp.id, opp);

  const boxMap =
    boxes ??
    (() => {
      const m = new Map<string, SumBox>();
      m.set(createBoxId(0, 0), {
        id: createBoxId(0, 0),
        targetSum: 5,
        row: 0,
        col: 0,
        rods: [null, null],
        completedBy: null,
      });
      m.set(createBoxId(0, 1), {
        id: createBoxId(0, 1),
        targetSum: 7,
        row: 0,
        col: 1,
        rods: [null, null],
        completedBy: null,
      });
      return m;
    })();

  return {
    boxes: boxMap,
    rods,
    playerRods: {
      player1: player1Rods.map((r) => r.id),
      player2: [opp.id],
    },
    currentPlayer: 'player1',
    selectedRod: null,
    phase: 'selectingRod',
    scores: { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
  };
}

describe('Ramrod – createInitialState', () => {
  it('deals starting rods and begins selecting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('selectingRod');
    expect(state.currentPlayer).toBe('player1');
    expect(state.playerRods.player1).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.playerRods.player2).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.boxes.size).toBe(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS);
  });
});

describe('Ramrod – select / place', () => {
  it('selects a rod and places it on a valid empty box slot', () => {
    const rod = createRod('r-short', 3);
    let state = controlledState([rod]);

    state = selectRod(state, rod.id);
    expect(state.phase).toBe('placingRod');
    expect(state.selectedRod).toBe(rod.id);

    const placements = getValidPlacements(state, rod.id);
    expect(placements.length).toBeGreaterThan(0);
    const { boxId, slot } = placements[0];

    state = placeRod(state, boxId, slot);
    expect(state.boxes.get(boxId)?.rods[slot]?.id).toBe(rod.id);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingRod');
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].capturedBox).toBe(false);
  });

  it('rejects oversized rods that exceed the box target', () => {
    const rod = createRod('r-huge', 10);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    });
    const state = controlledState([rod], boxes);

    expect(isValidPlacement(state, rod.id, createBoxId(0, 0), 0)).toBe(false);
    expect(getValidPlacements(state, rod.id)).toEqual([]);

    let placing = selectRod(state, rod.id);
    const before = placing;
    expect(placeRod(placing, createBoxId(0, 0), 0)).toBe(before);
  });

  it('completes a box when the second rod sums to the target', () => {
    const first = createRod('r-a', 2);
    first.owner = 'player2';
    first.position = { boxId: createBoxId(0, 0), slot: 0 };

    const second = createRod('r-b', 3);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [first, null],
      completedBy: null,
    });

    let state = controlledState([second], boxes);
    // Ensure first rod is in the rods map
    state = {
      ...state,
      rods: new Map([...state.rods, [first.id, first]]),
    };

    expect(isValidPlacement(state, second.id, createBoxId(0, 0), 1)).toBe(
      true
    );

    state = selectRod(state, second.id);
    state = placeRod(state, createBoxId(0, 0), 1);

    const box = state.boxes.get(createBoxId(0, 0))!;
    expect(box.completedBy).toBe('player1');
    expect(state.scores.player1).toBe(5);
    expect(state.moveHistory[0].capturedBox).toBe(true);
    expect(state.moveHistory[0].pointsScored).toBe(5);
  });

  it('selectRod rejects rods not owned by current player', () => {
    const state = controlledState([createRod('mine', 2)]);
    expect(selectRod(state, 'opp-1')).toBe(state);
  });
});

describe('Ramrod – passTurn / hasValidMoves', () => {
  it('passTurn flips player and clears selection', () => {
    const rod = createRod('r1', 2);
    let state = selectRod(controlledState([rod]), rod.id);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
    expect(next.phase).toBe('selectingRod');
  });

  it('hasValidMoves reflects placeable rods', () => {
    const good = createRod('good', 3);
    expect(hasValidMoves(controlledState([good]))).toBe(true);

    const huge = createRod('huge', 10);
    const tinyBoxes = new Map<string, SumBox>();
    tinyBoxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    });
    expect(hasValidMoves(controlledState([huge], tinyBoxes))).toBe(false);
  });
});
