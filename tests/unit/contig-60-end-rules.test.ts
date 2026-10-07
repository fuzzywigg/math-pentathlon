/**
 * Official Contig 60 end rules (#379 / #380):
 * 5-in-a-row, full board, or both players passing in a row;
 * then most 4-in-a-rows, then most 3-in-a-rows, else draw.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  ContigState,
  Player,
  createInitialState,
} from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import {
  passTurn,
  checkWinner,
  countNInARows,
  alignmentTiebreak,
  isBoardFull,
} from '../../src/games/contig-60/rules';
import { initGame } from '../../src/games/contig-60/game-controller';

function withDice(
  state: ContigState,
  dice: [number, number, number] = [1, 1, 1]
): ContigState {
  return { ...state, currentDice: dice, phase: 'calculating' };
}

function claim(
  state: ContigState,
  values: number[],
  owner: Player
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    const cell = cells.get(value);
    if (!cell) throw new Error(`missing cell ${value}`);
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

function fillBoard(
  state: ContigState,
  ownerFor: (row: number, col: number) => Player
): ContigState {
  const cells = new Map(state.cells);
  for (const cell of cells.values()) {
    cells.set(cell.value, {
      ...cell,
      owner: ownerFor(cell.row, cell.col),
    });
  }
  return { ...state, cells };
}

describe('Contig 60 official end rules', () => {
  it('counts a single 4-in-a-row and nested 3-in-a-rows', () => {
    const state = claim(createInitialState(), [1, 2, 3, 4], 'player1');
    expect(countNInARows(state, 'player1', 4)).toBe(1);
    expect(countNInARows(state, 'player1', 3)).toBe(2);
    expect(countNInARows(state, 'player2', 4)).toBe(0);
  });

  it('5-in-a-row still wins immediately even if the opponent leads on points', () => {
    let state = claim(createInitialState(), [1, 2, 3, 4, 5], 'player1');
    state = { ...state, scores: { player1: 0, player2: 99 } };
    expect(checkWinner(state)).toBe('player1');
  });

  it('incomplete board without 5-in-a-row does not settle', () => {
    const state = claim(createInitialState(), [1, 2, 3, 4], 'player1');
    expect(checkWinner(state)).toBeNull();
  });

  it('tiebreak prefers more 4-in-a-rows over more 3-in-a-rows', () => {
    let state = claim(createInitialState(), [1, 2, 3, 4], 'player1');
    state = claim(state, [11, 12, 13, 25, 27, 28], 'player2');
    expect(countNInARows(state, 'player1', 4)).toBe(1);
    expect(countNInARows(state, 'player2', 4)).toBe(0);
    expect(checkWinner(state, { settle: true })).toBe('player1');
    expect(alignmentTiebreak(state)).toBe('player1');
  });

  it('tiebreak uses 3-in-a-rows when 4-in-a-rows are tied', () => {
    let state = claim(createInitialState(), [1, 2, 3], 'player1');
    state = claim(state, [11, 12], 'player2');
    expect(countNInARows(state, 'player1', 4)).toBe(0);
    expect(countNInARows(state, 'player2', 4)).toBe(0);
    expect(checkWinner(state, { settle: true })).toBe('player1');
  });

  it('tiebreak draw when 4s and 3s match', () => {
    let state = claim(createInitialState(), [1, 2, 3], 'player1');
    state = claim(state, [11, 12, 13], 'player2');
    expect(checkWinner(state, { settle: true })).toBe('draw');
  });

  it('full board settles by alignment, not adjacency points', () => {
    const state = fillBoard(createInitialState(), (row, col) =>
      col < 5 ? 'player1' : 'player2'
    );
    expect(isBoardFull(state)).toBe(true);
    const withP1Points = {
      ...state,
      scores: { player1: 1, player2: 99 },
    };
    const withP2Points = {
      ...state,
      scores: { player1: 99, player2: 1 },
    };
    const a = checkWinner(withP1Points);
    const b = checkWinner(withP2Points);
    expect(a).not.toBeNull();
    expect(a).toBe(b);
  });

  it('a lone player can pass three times without being eliminated', () => {
    let state = withDice(createInitialState());
    for (let i = 0; i < 3; i++) {
      state = passTurn({
        ...state,
        phase: 'calculating',
        currentDice: [1, 1, 1],
        currentPlayer: 'player1',
      });
    }
    expect(state.phase).toBe('rolling');
    expect(state.winner).toBeNull();
    expect(state.consecutivePasses.player1).toBe(3);
  });

  it('both players passing in a row ends the game via the tiebreak', () => {
    const first = passTurn(withDice(createInitialState()));
    expect(first.phase).toBe('rolling');
    expect(first.winner).toBeNull();

    const second = passTurn({
      ...first,
      phase: 'calculating',
      currentDice: [2, 2, 2],
    });
    expect(second.phase).toBe('gameOver');
    expect(second.winner).toBe('draw');
    expect(second.consecutivePasses).toEqual({ player1: 1, player2: 1 });
  });

  it('mutual pass with a 4-in-a-row lead awards that player', () => {
    const opened = claim(createInitialState(), [1, 2, 3, 4], 'player1');
    const afterP1 = passTurn(withDice(opened));
    const ended = passTurn({
      ...afterP1,
      phase: 'calculating',
      currentDice: [3, 3, 3],
    });
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });
});

describe('Contig 60 official end-rule chrome', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('contig-styles')?.remove();
    vi.restoreAllMocks();
  });

  it('draw banner does not use adjacency points', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      winner: 'draw',
      scores: { player1: 12, player2: 4 },
      phase: 'gameOver',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    const banner = status.querySelector('.contig-winner-banner')?.textContent ?? '';
    expect(banner).toMatch(/It's a tie!/);
    expect(banner).not.toMatch(/\d+\s*-\s*\d+/);
  });

  it('status does not show a 3-pass elimination counter', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      consecutivePasses: { player1: 2, player2: 0 },
      phase: 'rolling',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).not.toMatch(/\/3 passes/);
  });
});
