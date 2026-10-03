/**
 * FIAR Division II official rules — one+ coverage per numbered brief item.
 * Source: mp-highlights-division-2.pdf + Austin Trinity condensed materials list.
 * Board: verified 40-space layout (docs/mp3d/fiar-board/).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  createInitialState,
  createYellowCenterTestLayout,
  createVerifiedProductionLayout,
  createBoardFromLayout,
  countConfirmedEdges,
  INCLUDE_DIAMOND_BORDER_EDGES,
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

describe('0. Verified 40-space layout', () => {
  it('has 40 nodes, 116 confirmed edges, yellow diamond, verified flag', () => {
    const layout = createVerifiedProductionLayout();
    expect(layout.nodes).toHaveLength(40);
    expect(countConfirmedEdges()).toBe(116);
    expect(layout.edges).toHaveLength(116);
    expect(layout.verified).toBe(true);
    expect(layout.yellowCenter?.kind).toBe('diamond');
    expect(INCLUDE_DIAMOND_BORDER_EDGES).toBe(false);
    expect(layout.nodes.some((n) => n.id === 'c4r3')).toBe(false);
  });

  it('diamond-border flag adds 4 edges and more win lines', () => {
    const off = createVerifiedProductionLayout({
      includeDiamondBorderEdges: false,
    });
    const on = createVerifiedProductionLayout({
      includeDiamondBorderEdges: true,
    });
    expect(on.edges.length - off.edges.length).toBe(4);
    const linesOff = getStraightLines({
      ...createInitialState({ layout: off }),
      board: createBoardFromLayout(off),
    });
    const linesOn = getStraightLines({
      ...createInitialState({ layout: on }),
      board: createBoardFromLayout(on),
    });
    expect(linesOff).toHaveLength(24);
    expect(linesOn).toHaveLength(28);
  });
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
    s = placeChip(s, 'c0r3', 'marked');
    expect(s.board.nodes.get('c0r3')?.chipKind).toBe('marked');
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
    expect(canPlaceChip(s, 'c0r3', 'marked')).toBe(false);
    expect(canPlaceChip(s, 'c0r3', 'plain')).toBe(true);
  });
});

describe('3. Only marked chips block', () => {
  it('plain opponent adjacent does NOT block a 4-path', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1' },
      { nodeId: 'c2r2', player: 'player1' },
      { nodeId: 'c3r2', player: 'player1' },
      { nodeId: 'c4r2', player: 'player1' },
      { nodeId: 'c1r1', player: 'player2', kind: 'plain' },
    ]);
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    expect(isPathBlocked(s, path, 'player1')).toBe(false);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });

  it('marked opponent adjacent DOES block a 4-path', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1' },
      { nodeId: 'c2r2', player: 'player1' },
      { nodeId: 'c3r2', player: 'player1' },
      { nodeId: 'c4r2', player: 'player1' },
      { nodeId: 'c1r1', player: 'player2', kind: 'marked' },
    ]);
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    expect(isPathBlocked(s, path, 'player1')).toBe(true);
    expect(findAnyWinningPath(s)).toBeNull();
  });

  it('own marked chip can be part of a winning path', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1', kind: 'marked' },
      { nodeId: 'c2r2', player: 'player1' },
      { nodeId: 'c3r2', player: 'player1' },
      { nodeId: 'c4r2', player: 'player1' },
    ]);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });
});

describe('4. Gaps are allowed', () => {
  it('4 chips with an empty space between still win', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1' },
      { nodeId: 'c2r2', player: 'player1' },
      { nodeId: 'c4r2', player: 'player1' },
      { nodeId: 'c5r2', player: 'player1' },
    ]);
    const paths = findPaths(s, 'player1');
    expect(paths.some((p) => !p.isBlocked && p.nodes.length >= 4)).toBe(true);
    expect(findAnyWinningPath(s)?.color).toBe('player1');
  });

  it('opposite color intervening prevents the gapped win', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r2', player: 'player1' },
      { nodeId: 'c2r2', player: 'player1' },
      { nodeId: 'c3r2', player: 'player2' },
      { nodeId: 'c4r2', player: 'player1' },
      { nodeId: 'c5r2', player: 'player1' },
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
    s = forceChip(s, 'a', 'player1');
    s = forceChip(s, 'b', 'player1');
    s = forceChip(s, 'd', 'player1');
    s = forceChip(s, 'e', 'player1');
    expect(findAnyWinningPath(s)).toBeNull();

    s = forceChip(s, 'c', 'player1');
    s = forceChip(s, 'f', 'player1');
    expect(
      getStraightLines(s).every(
        (line) => !line.includes('a') || !line.includes('e')
      )
    ).toBe(true);
  });

  it('production board has no edge through c4r3 and splits r3 / c4', () => {
    const s = createInitialState();
    const lines = getStraightLines(s);
    expect(lines).toHaveLength(24);
    // Left and right r3 runs of 4
    expect(
      lines.some(
        (l) => l.includes('c0r3') && l.includes('c3r3') && !l.includes('c5r3')
      )
    ).toBe(true);
    expect(
      lines.some(
        (l) => l.includes('c5r3') && l.includes('c8r3') && !l.includes('c3r3')
      )
    ).toBe(true);
    // Column c4 never spans across the yellow gap
    expect(lines.some((l) => l.includes('c4r0') && l.includes('c4r6'))).toBe(
      false
    );
  });
});

describe('6. Wins during placement', () => {
  it('placeChip ends the game when a winning path appears', () => {
    let s = createInitialState();
    s = placeChip(s, 'c0r3', 'plain'); // P1
    s = placeChip(s, 'c1r2', 'plain'); // P2
    s = placeChip(s, 'c1r3', 'plain'); // P1
    s = placeChip(s, 'c2r2', 'plain'); // P2
    s = placeChip(s, 'c2r3', 'plain'); // P1
    s = placeChip(s, 'c3r2', 'plain'); // P2
    expect(s.winner).toBeNull();
    s = placeChip(s, 'c3r3', 'plain'); // P1 completes left r3
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBe('player1');
    expect(s.winningPath?.length).toBeGreaterThanOrEqual(4);
  });
});

describe('7. Winning with opponent color — actor credited', () => {
  it('moving your chip away that completes opponent line credits the mover', () => {
    let s = forgeMovementState([
      { nodeId: 'c1r4', player: 'player2' },
      { nodeId: 'c2r4', player: 'player2' },
      { nodeId: 'c3r4', player: 'player1' },
      { nodeId: 'c4r4', player: 'player2' },
      { nodeId: 'c5r4', player: 'player2' },
      { nodeId: 'c0r3', player: 'player1' },
    ]);
    s = { ...s, currentPlayer: 'player1' };
    expect(findAnyWinningPath(s)).toBeNull();

    const next = moveChip(s, 'c3r4', 'c3r3');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
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
    let s = createInitialState();
    const ids = [...s.board.nodes.keys()];
    for (let i = 0; i < ids.length; i++) {
      s = forceChip(s, ids[i]!, i % 2 === 0 ? 'player1' : 'player2');
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
    s = placeChip(s, 'c0r3', 'plain');
    s = placeChip(s, 'c1r2', 'plain');
    s = placeChip(s, 'c1r3', 'plain');
    s = placeChip(s, 'c2r2', 'plain');
    s = placeChip(s, 'c2r3', 'plain');
    s = placeChip(s, 'c3r2', 'plain');
    const move = getAIMove(s, 'player1', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBe('c3r3');
    const next = applyAIMove(s, move!);
    expect(next.winner).toBe('player1');
  });

  it('blocks an opponent immediate win by occupying the only threat square', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let s = createInitialState();
    s = placeChip(s, 'c0r3', 'plain'); // P1
    s = placeChip(s, 'c5r3', 'plain'); // P2 seals other side
    s = placeChip(s, 'c1r3', 'plain'); // P1
    s = placeChip(s, 'c8r3', 'plain'); // P2
    s = placeChip(s, 'c2r3', 'plain'); // P1 — next P1 win only at c3r3
    expect(s.currentPlayer).toBe('player2');
    const move = getAIMove(s, 'player2', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBe('c3r3');
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
      { nodeId: 'c1r2', player: 'player2' },
      { nodeId: 'c2r2', player: 'player2' },
      { nodeId: 'c3r2', player: 'player2' },
      { nodeId: 'c4r2', player: 'player2' },
    ]);
    expect(checkWinner(s)).toBe('player2');
  });
});
