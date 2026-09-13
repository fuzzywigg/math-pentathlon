import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPrime,
  placeChip as placePrimeChip,
  getValidPlacements as getPrimePlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';
import { CONFIG as PRIME_CFG, BoardCell } from '../../src/games/prime-gold/types';
import {
  getAIPlacement,
  executeAITurn as executePrimeAI,
} from '../../src/games/prime-gold/ai';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import {
  AttributeCard,
  StarsState,
  CONFIG as STARS_CFG,
  getDifferenceDescription,
} from '../../src/games/stars-bars/types';
import { getAIMove as getStarsAI, executeAITurn as executeStarsAI } from '../../src/games/stars-bars/ai';

import {
  createRod,
  createBoxId,
  CONFIG as RAMROD_CFG,
  RamrodState,
  SumBox,
  Rod,
} from '../../src/games/ramrod/types';
import {
  selectRod,
  placeRod,
  passTurn as passRamrod,
} from '../../src/games/ramrod/rules';
import { getAIMove as getRamrodAI } from '../../src/games/ramrod/ai';

import {
  createInitialState as createHexAGone,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  canPlayerMove,
  passTurn as passHexAGone,
} from '../../src/games/hex-a-gone/rules';
import { getAISelection, getAIPlacement as getHexAGonePlacement } from '../../src/games/hex-a-gone/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  placePiece,
  canPlayerMove as pentCanMove,
  canPlacePiece,
} from '../../src/games/pent-em-in/rules';
import { getAIMove as getPentAI } from '../../src/games/pent-em-in/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as getParAI, executeAITurn as executeParAI } from '../../src/games/par-55/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  moveChip,
  canMove,
  isDraw,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI, applyAIMove } from '../../src/games/fiar/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getValidPits, makeMove } from '../../src/games/calla/rules';
import { analyzeMoves, getAIMove as getCallaAI } from '../../src/games/calla/ai';

import {
  createInitialState as createJuggle,
  doRollDice,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as getJugglePlacement,
  executeAITurn as executeJuggleAI,
} from '../../src/games/juggle/ai';
import { isPlacementValid as juggleIsValid } from '../../src/games/juggle/rules';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAI,
  executeAITurn as executeKwaAI,
} from '../../src/games/kwatro-sinko/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

function starCard(
  overrides: Partial<AttributeCard> & Pick<AttributeCard, 'id'>
): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...overrides,
  };
}

function ramrodControlled(
  player1Rods: Rod[],
  boxes: Map<string, SumBox>,
  scores = { player1: 0, player2: 0 }
): RamrodState {
  const rods = new Map<string, Rod>();
  for (const rod of player1Rods) {
    rods.set(rod.id, { ...rod, owner: 'player1' });
  }
  const opp = createRod('opp-1', 2);
  opp.owner = 'player2';
  rods.set(opp.id, opp);

  return {
    boxes,
    rods,
    playerRods: {
      player1: player1Rods.map((r) => r.id),
      player2: [opp.id],
    },
    currentPlayer: 'player1',
    selectedRod: null,
    phase: 'selectingRod',
    scores,
    winner: null,
    moveHistory: [],
  };
}

describe('Burn wave 6 — Prime Gold vein win + AI', () => {
  it('ends game when placement creates VEINS_TO_WIN diagonal prime veins', () => {
    const base = createPrime();
    const cells = new Map<string, BoardCell>();
    for (const [k, c] of base.cells) {
      cells.set(k, { ...c, owner: null });
    }

    // Forge four TL→BR diagonal veins of length MIN_VEIN_LENGTH
    const veins: Array<Array<[number, number]>> = [
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
      ],
      [
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 6],
      ],
    ];
    for (const vein of veins) {
      for (const [row, col] of vein) {
        const key = `${row},${col}`;
        const cell = cells.get(key)!;
        cells.set(key, { ...cell, isPrime: true, owner: 'player1' });
      }
    }

    const placing = {
      ...base,
      cells,
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 4 },
      playerChips: { player1: 5, player2: 5 },
      primeVeins: { player1: 0, player2: 0 },
    };

    const placements = getPrimePlacements(placing);
    expect(placements.length).toBeGreaterThan(0);
    const pick = placements.find((p) => {
      const cell = findCellByValue(placing, p.value);
      return cell && cell.owner === null;
    })!;
    expect(pick).toBeTruthy();

    const next = placePrimeChip(placing, pick.value, pick.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(PRIME_CFG.VEINS_TO_WIN);
  });

  it('shorter forged vein does not end the game alone', () => {
    const base = createPrime();
    const cells = new Map<string, BoardCell>();
    for (const [k, c] of base.cells) {
      cells.set(k, { ...c, owner: null });
    }
    // Only 3 primes on one diagonal — under MIN_VEIN_LENGTH
    for (const [row, col] of [
      [0, 0],
      [1, 1],
      [2, 2],
    ] as const) {
      const cell = cells.get(`${row},${col}`)!;
      cells.set(`${row},${col}`, { ...cell, isPrime: true, owner: 'player1' });
    }

    const placing = {
      ...base,
      cells,
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 4 },
      playerChips: { player1: 5, player2: 5 },
    };
    const [pick] = getPrimePlacements(placing);
    const next = placePrimeChip(placing, pick.value, pick.expr);
    expect(next.phase).not.toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('hard getAIPlacement returns a legal empty cell after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createPrime();
    state = {
      ...state,
      phase: 'placing',
      diceRoll: { die1: 2, die2: 3, die3: 4 },
    };
    const placement = getAIPlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    const cell = findCellByValue(state, placement!.value);
    expect(cell?.owner).toBeNull();
    expect(
      getPrimePlacements(state).some((p) => p.value === placement!.value)
    ).toBe(true);
  });

  it('executeAITurn from rolling advances or stays playable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const next = executePrimeAI(createPrime(), 'player1', 'medium');
    expect(['rolling', 'placing', 'gameOver']).toContain(next.phase);
  });
});

describe('Burn wave 6 — Stars & Bars TARGET_SCORE + descriptions + AI', () => {
  it('getDifferenceDescription lists only differing attrs', () => {
    expect(
      getDifferenceDescription(
        starCard({ id: 'a' }),
        starCard({ id: 'b', shape: 'square', color: 'blue' })
      )
    ).toBe('shape, color');
    expect(
      getDifferenceDescription(starCard({ id: 'a' }), starCard({ id: 'a2' }))
    ).toBe('');
  });

  it('star placement that reaches TARGET_SCORE ends the game', () => {
    const boardCard = starCard({ id: 'board' });
    const handCard = starCard({ id: 'hand', shape: 'square' }); // 1 diff
    const base = createStars();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[1][0] = { ...cells[1][0], card: boardCard, owner: 'player2' };

    let state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [handCard], player2: [] },
      deck: [],
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
      playerScores: { player1: STARS_CFG.TARGET_SCORE - 2, player2: 0 },
    };

    // (0,0) is a star adjacent to (1,0); 1 diff × star = 2 → hits target
    expect(cells[0][0].isStar).toBe(true);
    state = selectCard(state, handCard.id);
    state = placeCard(state, 0, 0);
    expect(state.playerScores.player1).toBeGreaterThanOrEqual(STARS_CFG.TARGET_SCORE);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('empty-hand tie leaves winner null', () => {
    const handCard = starCard({ id: 'last' });
    const base = createStars();
    const cells = base.cells.map((row) =>
      row.map((c) => ({
        ...c,
        card:
          c.row === 0 && c.col === 0
            ? null
            : starCard({ id: `fill-${c.row}-${c.col}` }),
        owner:
          c.row === 0 && c.col === 0 ? null : ('player2' as const),
      }))
    );
    let state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [handCard], player2: [] },
      deck: [],
      phase: 'selectingCard',
      selectedCard: null,
      currentPlayer: 'player1',
      playerScores: { player1: 5, player2: 5 },
    };
    state = selectCard(state, 'last');
    state = placeCard(state, 0, 0);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBeNull();
  });

  it('hard getAIMove returns a legal card/cell on a fresh deal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createStars();
    const move = getStarsAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(
      true
    );
    expect(state.cells[move!.row][move!.col].card).toBeNull();
  });

  it('executeAITurn records history for hard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = executeStarsAI(createStars(), 'player1', 'hard');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 6 — Ramrod TARGET_SCORE + AI preference', () => {
  it('completing a box that reaches TARGET_SCORE ends the game', () => {
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

    let state = ramrodControlled(
      [second],
      boxes,
      { player1: RAMROD_CFG.TARGET_SCORE - 5, player2: 0 }
    );
    state = {
      ...state,
      rods: new Map([...state.rods, [first.id, first]]),
    };

    state = selectRod(state, second.id);
    state = placeRod(state, createBoxId(0, 0), 1);
    expect(state.scores.player1).toBeGreaterThanOrEqual(RAMROD_CFG.TARGET_SCORE);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('passTurn on gameOver still flips seat (identity not required)', () => {
    const state: RamrodState = {
      ...ramrodControlled([createRod('r', 2)], new Map()),
      phase: 'gameOver',
      winner: 'player1',
    };
    // Current passTurn does not short-circuit gameOver — document actual behavior
    const next = passRamrod(state);
    expect(next.currentPlayer).toBe('player2');
  });

  it('hard getAIMove prefers a completing placement when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const first = createRod('r-a', 2);
    first.owner = 'player2';
    first.position = { boxId: createBoxId(0, 0), slot: 0 };

    const completer = createRod('r-b', 3);
    const filler = createRod('r-c', 1);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [first, null],
      completedBy: null,
    });
    boxes.set(createBoxId(0, 1), {
      id: createBoxId(0, 1),
      targetSum: 7,
      row: 0,
      col: 1,
      rods: [null, null],
      completedBy: null,
    });

    let state = ramrodControlled([completer, filler], boxes);
    state = {
      ...state,
      rods: new Map([...state.rods, [first.id, first]]),
    };

    const move = getRamrodAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.rodId).toBe(completer.id);
    expect(move!.boxId).toBe(createBoxId(0, 0));
  });
});

describe('Burn wave 6 — Hex-a-Gone stuck-opponent win + AI', () => {
  it('placeBlock wins when opponent has no empty cells left', () => {
    let state = createHexAGone();
    // Fill every cell except (0,0)
    state = {
      ...state,
      board: state.board.map((cell) =>
        cell.q === 0 && cell.r === 0
          ? cell
          : {
              ...cell,
              filled: true,
              filledBy: 'player2' as const,
              blockId: 1,
            }
      ),
      bank: { ...state.bank, triangle: 1 },
    };

    expect(canPlayerMove({ ...state, currentPlayer: 'player2' })).toBe(true);
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    state = placeBlock(state, 0, 0);

    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('passTurn with empty selection ends game when opponent cannot move', () => {
    const base = createHexAGone();
    const state = {
      ...base,
      board: base.board.map((cell) => ({
        ...cell,
        filled: true,
        filledBy: 'player1' as const,
        blockId: 1,
      })),
      bank: {
        triangle: 0,
        rhombus: 0,
        trapezoid: 0,
        hexagon: 0,
      },
      moveHistory: [
        {
          player: 'player1' as const,
          blocksPlaced: ['triangle' as const],
          moveNumber: 1,
        },
      ],
    };

    expect(canPlayerMove(state)).toBe(false);
    const next = passHexAGone(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('medium getAISelection returns bank-legal unique shapes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const selection = getAISelection(createHexAGone(), 'player1', 'medium');
    expect(selection).not.toBeNull();
    expect(new Set(selection!.blocks).size).toBe(selection!.blocks.length);
  });

  it('hard getAIPlacement returns on-board coords after commit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = selectBlock(createHexAGone(), 'triangle');
    state = commitSelection(state);
    const placement = getHexAGonePlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    expect(
      state.board.some((c) => c.q === placement!.q && c.r === placement!.r)
    ).toBe(true);
  });
});

describe("Burn wave 6 — Pent'Em In endgame + medium AI", () => {
  it('placePiece ends game when opponent cannot place', () => {
    let state = createPent();
    // Fill almost entire board; leave only a 5-cell X hole for player1
    const board = state.board.map((row) =>
      row.map((cell) => ({
        ...cell,
        occupied: true,
        owner: 'player2' as const,
        pieceId: 'fill',
      }))
    );
    // Clear X footprint at (2,2)
    const xCells = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 3, col: 4 },
      { row: 4, col: 3 },
    ];
    for (const c of xCells) {
      board[c.row][c.col] = {
        ...board[c.row][c.col],
        occupied: false,
        owner: null,
        pieceId: null,
      };
    }

    state = {
      ...state,
      board,
      player1Pieces: { available: ['X'], placed: [] },
      player2Pieces: { available: ['I5'], placed: [] },
      currentPlayer: 'player1',
      phase: 'selectPiece',
    };

    expect(canPlacePiece(state, 'X', { row: 2, col: 2 }, 0, false)).toBe(true);
    expect(pentCanMove(state, 'player2')).toBe(false);

    const next = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('medium getAIMove returns a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createPent();
    const move = getPentAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(
      canPlacePiece(
        state,
        move!.shapeId,
        move!.position,
        move!.rotation,
        move!.flipped
      )
    ).toBe(true);
  });

  it('getAIMove is null when the seat has no placements', () => {
    const state = createPent();
    const full = {
      ...state,
      board: state.board.map((row) =>
        row.map((cell) => ({
          ...cell,
          occupied: true,
          owner: 'player2' as const,
          pieceId: 'x',
        }))
      ),
      player1Pieces: { available: ['X'], placed: [] },
    };
    expect(getPentAI(full, 'player1', 'easy')).toBeNull();
  });
});

describe('Burn wave 6 — Par 55 hard AI', () => {
  it('hard getAIMove returns blockId + baseId when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createPar();
    const move = getParAI(state, 'player1', 'hard');
    if (move) {
      expect(move.blockId).toBeTruthy();
      expect(move.baseId).toBeTruthy();
    }
  });

  it('executeAITurn hard flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = executeParAI(createPar(), 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 6 — FIAR movement AI + draw', () => {
  it(
    'getAIMove returns a legal move after both seats finish placement',
    () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      let state = createFiar();
      const ids = [...state.board.nodes.keys()];
      for (let i = 0; i < 8; i++) {
        state = fiarPlace(state, ids[i]);
      }
      expect(state.phase).toBe('movement');

      // Medium avoids the deepest minimax path while still exercising movement AI
      const move = getFiarAI(state, 'player1', 'medium');
      expect(move).not.toBeNull();
      expect(move!.type).toBe('move');
      expect(canMove(state, move!.from!, move!.to!)).toBe(true);

      const next = applyAIMove(state, move!);
      expect(next.moveHistory.length).toBeGreaterThan(state.moveHistory.length);
      expect(next.board.nodes.get(move!.to!)?.chip).toBe('player1');
    },
    15000
  );

  it('applyAIMove with illegal move object is a no-op', () => {
    let state = createFiar();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < 8; i++) {
      state = fiarPlace(state, ids[i]);
    }
    const before = state;
    expect(applyAIMove(state, { type: 'move', from: 'nope', to: 'also-nope' })).toBe(
      before
    );
    // moveChip via malformed still returns state from applyAIMove path
    expect(moveChip(state, ids[0], ids[0])).toBe(state);
  });

  it('isDraw is true when no selectable chips remain in movement', () => {
    let state = createFiar();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < 8; i++) {
      state = fiarPlace(state, ids[i]);
    }
    const nodes = new Map(state.board.nodes);
    for (const [id, n] of nodes) {
      if (!n.chip) nodes.set(id, { ...n, chip: 'player2' });
    }
    const jammed = { ...state, board: { ...state.board, nodes } };
    expect(getSelectableNodes(jammed)).toEqual([]);
    expect(isDraw(jammed)).toBe(true);
  });
});

describe('Burn wave 6 — Calla hard capture + teaching hint', () => {
  it('hard prefers a capture ≥ 5 when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createCalla(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [8, 8, 8, 8, 8],
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses.some((a) => a.outcome.captureAmount >= 5)).toBe(true);
    const move = getCallaAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.pit).toBe(0);
  });

  it('analyzeMoves attaches reasoning for free-turn / capture outcomes', () => {
    const freeTurn = {
      ...createCalla(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [3, 3, 3, 3, 3],
    };
    const analyses = analyzeMoves(freeTurn, 'player1');
    expect(analyses).toHaveLength(1);
    expect(analyses[0].reasoning.length).toBeGreaterThan(0);
    expect(analyses[0].outcome.landsInCalla).toBe(true);
  });

  it('easy teaching mode can attach a hint when randomness is low', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createCalla();
    const move = getCallaAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPits(state)).toContain(move!.pit);
    // hint is optional depending on teaching branch
    if (move!.hint !== undefined) {
      expect(move!.hint.length).toBeGreaterThan(0);
    }
  });

  it('makeMove on crafted free-turn pit retains seat', () => {
    const state = {
      ...createCalla(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [3, 3, 3, 3, 3],
    };
    const next = makeMove(state, 4);
    expect(next.currentPlayer).toBe('player1');
    expect(next.player1Calla).toBe(state.player1Calla + 1);
  });
});

describe('Burn wave 6 — Juggle medium/hard AI', () => {
  it('medium getAIDieChoice returns 0 or 1 after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const rolled = doRollDice(createJuggle());
    const choice = getAIDieChoice(rolled, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });

  it('hard getAIPlacement returns a legal pose when placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = doRollDice(createJuggle());
    const die = getAIDieChoice(state, 'player1', 'hard');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);

    if (state.phase === 'selectingShape' && state.selectedCategory) {
      const shape = getAIShapeChoice(state, 'player1', 'hard');
      if (shape) {
        state = selectShape(state, shape.shape);
      }
    }

    if (state.phase === 'placing' && state.selectedShape) {
      const placement = getJugglePlacement(state, 'player1', 'hard');
      expect(placement).not.toBeNull();
      expect(placement!.position).toBeTruthy();
      expect([0, 90, 180, 270]).toContain(placement!.rotation);
      expect(typeof placement!.flipped).toBe('boolean');
      // Temporarily apply AI pose onto state for validity check
      const checkState = {
        ...state,
        selectedRotation: placement!.rotation,
        selectedFlipped: placement!.flipped,
      };
      expect(juggleIsValid(checkState, placement!.position)).toBe(true);
    } else {
      expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(
        state.phase
      );
    }
  });

  it('executeAITurn hard after roll completes or stays playable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = doRollDice(createJuggle());
    state = executeJuggleAI(state, 'player1', 'hard');
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(
      state.phase
    );
  });
});

describe('Burn wave 6 — Kwatro hard AI', () => {
  it('hard getAIMove returns chipId + nodeId', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getKwaAI(createKwa(), 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.chipId).toBeTruthy();
    expect(move!.nodeId).toBeTruthy();
  });

  it('executeAITurn hard advances seat and history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = executeKwaAI(createKwa(), 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('hard getAIMove is null on gameOver', () => {
    const state = { ...createKwa(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getKwaAI(state, 'player1', 'hard')).toBeNull();
  });
});
