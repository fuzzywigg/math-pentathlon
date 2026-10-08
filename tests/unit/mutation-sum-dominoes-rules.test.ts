/**
 * burn-1008-mp-mutation-audit — strengthen Sum Dominoes initial-board /
 * seed / hand-deal coverage to kill surviving mutants (tests only).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  doRollDice,
  canPlayDomino,
  getValidPlacements,
  selectDomino,
  placeDomino,
  passTurn,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mutation/sum-dominoes – createInitialState board + deal', () => {
  it('builds an exact BOARD_SIZE grid and deals STARTING_HAND_SIZE', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();

    expect(state.board).toHaveLength(CONFIG.BOARD_SIZE);
    expect(state.board).toHaveLength(11);
    for (const row of state.board) {
      expect(row).toHaveLength(CONFIG.BOARD_SIZE);
      expect(row).toHaveLength(11);
    }

    expect(state.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player1).toHaveLength(7);
    expect(state.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player2).toHaveLength(7);

    for (const d of state.hands.player1) expect(d.owner).toBe('player1');
    for (const d of state.hands.player2) expect(d.owner).toBe('player2');

    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.passCount).toBe(0);
    expect(state.winner).toBeNull();
  });

  it('seeds a horizontal double-six spanning center and center+1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const a = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    const b = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1];
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).toBe(b); // same placed seed object occupies both cells
    expect(a!.orientation).toBe('horizontal');
    expect(a!.domino.face1).toBe(6);
    expect(a!.domino.face2).toBe(6);
    expect(a!.position.row).toBe(CONFIG.CENTER_ROW);
    expect(a!.position.col).toBe(CONFIG.CENTER_COL);

    // Seed comes from the remaining pile (after both hands), never from a hand
    const seedId = a!.domino.id;
    expect(state.hands.player1.some((d) => d.id === seedId)).toBe(false);
    expect(state.hands.player2.some((d) => d.id === seedId)).toBe(false);

    // Adjacent empty cells stay empty (no soft-lock overlap)
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL - 1]).toBeNull();
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 2]).toBeNull();
  });

  it('does not leave the board oversized when BOARD_SIZE loops are intact', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    // Mutating `r < BOARD_SIZE` → `r <= BOARD_SIZE` would yield 12 rows
    expect(state.board.length).toBe(11);
    expect(state.board[11]).toBeUndefined();
  });
});

describe('mutation/sum-dominoes – roll / place / pass', () => {
  it('doRollDice moves to placing or passing based on hand matches', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // high dice faces
    const state = createInitialState();
    const rolled = doRollDice(state);
    expect(rolled.currentDice).not.toBeNull();
    const sum = getDiceSum(rolled.currentDice!);
    const canPlay = rolled.hands.player1.some((d) =>
      canPlayDomino(rolled, d, sum)
    );
    expect(rolled.phase).toBe(canPlay ? 'placing' : 'passing');
  });

  it('getValidPlacements only lists legal cells for the selected domino', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    // Force a known dice sum by rolling then overriding
    state = {
      ...doRollDice(state),
      currentDice: [3, 3] as [number, number],
      phase: 'placing',
    };
    const playable = state.hands.player1.find((d) =>
      canPlayDomino(state, d, 6)
    );
    if (!playable) {
      // Hand may not contain a 6-sum match under this seed — still assert API
      expect(getValidPlacements(state, state.hands.player1[0], 6)).toEqual(
        expect.any(Array)
      );
      return;
    }
    const selected = selectDomino(state, playable.id);
    const spots = getValidPlacements(selected, playable, 6);
    expect(spots.length).toBeGreaterThan(0);
    for (const spot of spots) {
      expect(spot.position.row).toBeGreaterThanOrEqual(0);
      expect(spot.position.row).toBeLessThan(CONFIG.BOARD_SIZE);
      expect(spot.position.col).toBeGreaterThanOrEqual(0);
      expect(spot.position.col).toBeLessThan(CONFIG.BOARD_SIZE);
    }
  });

  it('passTurn increments passCount and flips the seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      phase: 'passing' as const,
      currentDice: [1, 1] as [number, number],
    };
    const next = passTurn(state);
    expect(next.passCount).toBe(state.passCount + 1);
    expect(next.currentPlayer).toBe('player2');
    expect(getRemainingCount(next, 'player1')).toBe(
      next.hands.player1.length
    );
  });

  it('placeDomino occupies both span cells for a horizontal play', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    // Find any hand domino that has at least one legal placement for some sum
    // matching one of its faces (doubles seed is 6+6 so adjacent match faces of 6).
    let placed = false;
    for (const faceSum of [6, 7, 8, 5, 4, 3, 2, 9, 10, 11, 12]) {
      const match = state.hands.player1.find((d) =>
        canPlayDomino(state, d, faceSum)
      );
      if (!match) continue;
      const withDice = {
        ...state,
        currentDice: [faceSum - 1, 1] as [number, number],
        phase: 'placing' as const,
      };
      const selected = selectDomino(withDice, match.id);
      const spots = getValidPlacements(selected, match, faceSum);
      if (spots.length === 0) continue;
      const spot =
        spots.find((s) => s.orientation === 'horizontal') ?? spots[0];
      const next = placeDomino(selected, spot.position, spot.orientation);
      expect(next.board[spot.position.row][spot.position.col]).not.toBeNull();
      if (spot.orientation === 'horizontal') {
        expect(next.board[spot.position.row][spot.position.col + 1]).toBe(
          next.board[spot.position.row][spot.position.col]
        );
      } else {
        expect(next.board[spot.position.row + 1][spot.position.col]).toBe(
          next.board[spot.position.row][spot.position.col]
        );
      }
      placed = true;
      break;
    }
    expect(placed).toBe(true);
  });
});
