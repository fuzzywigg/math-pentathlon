/**
 * FIAR Division II official rules — one+ coverage per numbered brief item.
 * Source: mp-highlights-division-2.pdf + Austin Trinity condensed materials list.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  createInitialState,
  createYellowCenterTestLayout,
  createBoardFromLayout,
} from '../../src/games/fiar/types';
import {
  canPlaceChip,
  placeChip,
  moveChip,
  checkWinner,
  findPaths,
  findAnyWinningPath,
  isPathBlocked,
  isDraw,
  getValidMoves,
  forceChip,
  getStraightLines,
} from '../../src/games/fiar/rules';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import {
  forgeMovementState,
  placeToMovement,
  SAFE_PLACEMENT_TO_MOVEMENT,
} from './fiar-test-helpers';
import * as GameController from '../../src/games/fiar/game-controller';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('1. Seven chips per player', () => {
  it('CONFIG.CHIPS_PER_PLAYER is 7 with 5 plain + 2 marked', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(7);
    expect(CONFIG.PLAIN_CHIPS_PER_PLAYER).toBe(5);
    expect(CONFIG.MARKED_CHIPS_PER_PLAYER).toBe(2);
  });

  it('initial inventory is 5 plain and 2 marked each', () => {
    const s = createInitialState();
    expect(s.chipInventory.player1).toEqual({ plain: 5, marked: 2 });
    expect(s.chipInventory.player2).toEqual({ plain: 5, marked: 2 });
  });

  it('transitions to movement after 14 placements (7 each)', () => {
    expect(SAFE_PLACEMENT_TO_MOVEMENT).toHaveLength(14);
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    expect(state.winner).toBeNull();
    expect(state.chipsPlaced.player1).toBe(7);
    expect(state.chipsPlaced.player2).toBe(7);
  });
});

describe('2. Marked blocker chips (Fire Extinguisher)', () => {
  it('placeChip consumes marked inventory when kind is marked', () => {
    let s = createInitialState();
    s = placeChip(s, '0-0', 'marked');
    expect(s.board.nodes.get('0-0')?.chipKind).toBe('marked');
    expect(s.chipInventory.player1.marked).toBe(1);
    expect(s.chipInventory.player1.plain).toBe(5);
  });

  it('cannot place marked when marked inventory is empty', () => {
    let s = createInitialState();
    s = {
      ...s,
      chipInventory: {
        ...s.chipInventory,
        player1: { plain: 5, marked: 0 },
      },
    };
    expect(canPlaceChip(s, '0-0', 'marked')).toBe(false);
    expect(canPlaceChip(s, '0-0', 'plain')).toBe(true);
  });
});

describe('3. Only marked chips block', () => {
  it('plain opponent adjacent does NOT block a 4-path', () => {
    let s = forgeMovementState([
      { nodeId: '2-0', player: 'player1' },
      { nodeId: '2-1', player: 'player1' },
      { nodeId: '2-2', player: 'player1' },
      { nodeId: '2-3', player: 'player1' },
      { nodeId: '1-0', player: 'player2', kind: 'plain' },
    ]);
    const path = ['2-0', '2-1', '2-2', '2-3'];
    expect(isPathBlocked(s, path, 'player1')).toBe(false);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });

  it('marked opponent adjacent DOES block a 4-path', () => {
    let s = forgeMovementState([
      { nodeId: '2-0', player: 'player1' },
      { nodeId: '2-1', player: 'player1' },
      { nodeId: '2-2', player: 'player1' },
      { nodeId: '2-3', player: 'player1' },
      { nodeId: '1-0', player: 'player2', kind: 'marked' },
    ]);
    const path = ['2-0', '2-1', '2-2', '2-3'];
    expect(isPathBlocked(s, path, 'player1')).toBe(true);
    expect(findAnyWinningPath(s)).toBeNull();
  });

  it('own marked chip can be part of a winning path', () => {
    let s = forgeMovementState([
      { nodeId: '2-0', player: 'player1', kind: 'marked' },
      { nodeId: '2-1', player: 'player1' },
      { nodeId: '2-2', player: 'player1' },
      { nodeId: '2-3', player: 'player1' },
    ]);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });
});

describe('4. Gaps are allowed', () => {
  it('4 chips with an empty space between still win', () => {
    // 2-0, 2-1, (empty 2-2), 2-3, 2-4 — 4 chips on a line with a gap
    let s = forgeMovementState([
      { nodeId: '2-0', player: 'player1' },
      { nodeId: '2-1', player: 'player1' },
      { nodeId: '2-3', player: 'player1' },
      { nodeId: '2-4', player: 'player1' },
    ]);
    const paths = findPaths(s, 'player1');
    expect(paths.some((p) => !p.isBlocked && p.nodes.length >= 4)).toBe(true);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });

  it('opposite color intervening prevents the gapped win', () => {
    let s = forgeMovementState([
      { nodeId: '2-0', player: 'player1' },
      { nodeId: '2-1', player: 'player1' },
      { nodeId: '2-2', player: 'player2' },
      { nodeId: '2-3', player: 'player1' },
      { nodeId: '2-4', player: 'player1' },
    ]);
    expect(findAnyWinningPath(s)?.color).not.toBe('player1');
  });
});

describe('5. Yellow center — data-driven (fixture layout)', () => {
  it('cannot move across a yellow-crossing edge', () => {
    const layout = createYellowCenterTestLayout();
    let s = createInitialState({ layout });
    s = {
      ...s,
      phase: 'movement',
      board: createBoardFromLayout(layout),
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 0, marked: 0 },
      },
      chipsPlaced: { player1: 1, player2: 0 },
    };
    s = forceChip(s, 'a', 'player1');
    // a→b is fine; b→c crosses yellow so cannot reach c from a in one ray
    const moves = getValidMoves(s, 'a');
    expect(moves).toContain('b');
    expect(moves).not.toContain('c');
    expect(moves).not.toContain('d');
  });

  it('winning path cannot bridge across yellow', () => {
    const layout = createYellowCenterTestLayout();
    let s = createInitialState({ layout });
    s = {
      ...s,
      phase: 'movement',
      board: createBoardFromLayout(layout),
      chipsPlaced: { player1: 4, player2: 0 },
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 0, marked: 0 },
      },
    };
    // Chips on a,b and d,e — same line but yellow between b and c splits it
    s = forceChip(s, 'a', 'player1');
    s = forceChip(s, 'b', 'player1');
    s = forceChip(s, 'd', 'player1');
    s = forceChip(s, 'e', 'player1');
    expect(findAnyWinningPath(s)).toBeNull();

    // Contiguous side without crossing still works if 4 exist — add c,f on non-cross
    s = forceChip(s, 'c', 'player1');
    s = forceChip(s, 'f', 'player1');
    // c,d,e + need 4 on a non-crossing segment: c-d-e is only 3
    // Place on a line without yellow: use only c,d,e and we need a 4th on that side — none
    expect(getStraightLines(s).every((line) => !line.includes('a') || !line.includes('e'))).toBe(
      true
    );
  });
});

describe('6. Wins during placement', () => {
  it('placeChip ends the game when a winning path appears', () => {
    // Build 3 for P1, P2 places elsewhere, P1 places 4th
    let s = createInitialState();
    s = placeChip(s, '0-0', 'plain'); // P1
    s = placeChip(s, '4-0', 'plain'); // P2
    s = placeChip(s, '0-1', 'plain'); // P1
    s = placeChip(s, '4-1', 'plain'); // P2
    s = placeChip(s, '0-2', 'plain'); // P1
    s = placeChip(s, '4-2', 'plain'); // P2
    expect(s.winner).toBeNull();
    s = placeChip(s, '0-3', 'plain'); // P1 completes row
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBe('player1');
    expect(s.winningPath?.length).toBeGreaterThanOrEqual(4);
  });
});

describe('7. Winning with opponent color — actor credited', () => {
  it('moving your chip away that completes opponent line credits the mover', () => {
    // P2 has 4 on row 4 with a gap blocked by P1 chip; P1 moves off → P2 path forms → P1 wins
    let s = forgeMovementState([
      { nodeId: '4-0', player: 'player2' },
      { nodeId: '4-1', player: 'player2' },
      { nodeId: '4-2', player: 'player1' }, // intervening — about to move away
      { nodeId: '4-3', player: 'player2' },
      { nodeId: '4-4', player: 'player2' },
      { nodeId: '0-0', player: 'player1' },
    ]);
    s = { ...s, currentPlayer: 'player1' };
    expect(findAnyWinningPath(s)).toBeNull();

    // Move P1 chip from 4-2 to 3-2 (vertical open)
    const next = moveChip(s, '4-2', '3-2');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1'); // actor, not path color
    expect(next.winningPathColor).toBe('player2');
  });
});

describe('8. Random first player (vs AI)', () => {
  it('newGameVsAI uses random starter and exposes starter on state', () => {
    document.body.innerHTML =
      '<div id="app"><div id="board"></div><div id="status"></div></div>';
    const board = document.getElementById('board')!;
    const status = document.getElementById('status')!;
    GameController.initGame(board, status);

    vi.spyOn(Math, 'random').mockReturnValue(0.9); // >= 0.5 → player2
    GameController.newGameVsAI('easy');
    const state = GameController.getCurrentState();
    expect(state.starter).toBe('player2');
    expect(state.currentPlayer).toBe('player2');
    expect(status.querySelector('[data-starter="player2"]')).toBeTruthy();
  });
});

describe('Draw rule (no timer)', () => {
  it('isDraw when current player has no legal moves in movement', () => {
    // Trap: fill board so P1 chips have no empty ray
    let s = createInitialState();
    // Fill all nodes alternating — then force movement with no moves for P1
    const ids = [...s.board.nodes.keys()];
    for (let i = 0; i < ids.length; i++) {
      s = forceChip(s, ids[i], i % 2 === 0 ? 'player1' : 'player2');
    }
    s = {
      ...s,
      phase: 'movement',
      currentPlayer: 'player1',
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 0, marked: 0 },
      },
    };
    expect(isDraw(s)).toBe(true);
  });
});

describe('AI — win and block under new rules', () => {
  it('takes an immediate placement win when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let s = createInitialState();
    s = placeChip(s, '0-0', 'plain');
    s = placeChip(s, '4-0', 'plain');
    s = placeChip(s, '0-1', 'plain');
    s = placeChip(s, '4-1', 'plain');
    s = placeChip(s, '0-2', 'plain');
    s = placeChip(s, '4-2', 'plain');
    // P1 to move — AI as P1 should place on 0-3
    const move = getAIMove(s, 'player1', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBe('0-3');
    const next = applyAIMove(s, move!);
    expect(next.winner).toBe('player1');
  });

  it('blocks an opponent immediate win by occupying the only threat square', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let s = createInitialState();
    // P1 has 0-0,0-1,0-2; P2 already occupies 0-4 so only 0-3 completes the line
    s = placeChip(s, '0-0', 'plain'); // P1
    s = placeChip(s, '0-4', 'plain'); // P2 seals far end
    s = placeChip(s, '0-1', 'plain'); // P1
    s = placeChip(s, '4-4', 'plain'); // P2
    s = placeChip(s, '0-2', 'plain'); // P1 — next P1 win only at 0-3
    expect(s.currentPlayer).toBe('player2');
    const move = getAIMove(s, 'player2', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBe('0-3');
  });

  it('prefers plain over marked for a non-blocking opening place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.chipKind).toBe('plain');
  });
});

describe('checkWinner color helper still reports path color', () => {
  it('returns path color not necessarily the actor', () => {
    const s = forgeMovementState([
      { nodeId: '1-0', player: 'player2' },
      { nodeId: '1-1', player: 'player2' },
      { nodeId: '1-2', player: 'player2' },
      { nodeId: '1-3', player: 'player2' },
    ]);
    expect(checkWinner(s)).toBe('player2');
  });
});
