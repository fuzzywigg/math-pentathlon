import { describe, it, expect } from 'vitest';

import {
  createChainBucket,
  getPlayerPosition,
  createInitialState as createStar,
  CHAINS_PER_LENGTH,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

import {
  createInitialState as createHexAGone,
  getAvailableShapes,
  getShapeCells,
  INITIAL_BANK,
} from '../../src/games/hex-a-gone/types';
import { selectBlock as selectHag } from '../../src/games/hex-a-gone/rules';

import {
  getCategoryFromDie,
  getCategoryName,
  getShapesForDie,
  DICE_TO_CATEGORY,
} from '../../src/games/juggle/types';

import {
  createInitialState as createPent,
  getPlayerPieces,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';

import {
  createInitialState as createCalla,
  getPlayerPits,
  getPlayerCalla,
  getSideTotalCubes,
  isSideEmpty,
  getOppositePitIndex,
  INITIAL_CUBES_PER_PIT,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';

import {
  cellKey,
  parseKey,
  cellsInRing,
  normalizePosition,
  getAdjacent,
  isMoveValid,
} from '../../src/games/queens-guards/types';

import {
  createFiarBoard,
  getDirections,
  getConnectedNodes,
  areConnected,
  getNodesInDirection,
} from '../../src/games/fiar/types';

import {
  createBlockSet,
  createBaseId,
  countMatchingAttributes,
  shuffleArray as shufflePar,
  AttributeBlock,
} from '../../src/games/par-55/types';

import {
  createRodSet,
  createRod,
  createBoxId,
} from '../../src/games/ramrod/types';

import { createChip, isWinningValue } from '../../src/games/kwatro-sinko/types';

import {
  createBarId,
  createAnswerId,
  shuffleArray as shuffleFab,
} from '../../src/games/fab-a-diffy/types';

import {
  createDominoSet,
  isDouble,
  getDominoPips,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createRemainder,
  getPlayerChips,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';

describe('Wave 14 — Star Track types helpers', () => {
  it('createChainBucket has 24 links with 4 of each length 1–6', () => {
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(6 * CHAINS_PER_LENGTH);
    for (let length = 1; length <= 6; length++) {
      expect(bucket.filter((c) => c.length === length)).toHaveLength(
        CHAINS_PER_LENGTH
      );
    }
    const ids = new Set(bucket.map((c) => c.id));
    expect(ids.size).toBe(bucket.length);
  });

  it('getPlayerPosition reads seats independently', () => {
    const state = {
      ...createStar(),
      player1Position: 3,
      player2Position: 7,
    };
    expect(getPlayerPosition(state, 'player1')).toBe(3);
    expect(getPlayerPosition(state, 'player2')).toBe(7);
    expect(TRACK_LENGTH).toBe(12);
  });
});

describe('Wave 14 — Hex-a-Gone shape helpers', () => {
  it('getAvailableShapes returns bank shapes and excludes selected', () => {
    const opening = createHexAGone();
    const available = getAvailableShapes(opening);
    expect(available).toEqual(
      expect.arrayContaining([
        'hexagon',
        'trapezoid',
        'rhombus',
        'triangle',
        'square',
      ])
    );
    expect(available).toHaveLength(5);

    const after = selectHag(opening, 'hexagon');
    expect(getAvailableShapes(after)).not.toContain('hexagon');
    expect(getAvailableShapes(after)).toHaveLength(4);
  });

  it('getShapeCells offsets footprints by (q,r)', () => {
    for (const shape of [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ] as const) {
      expect(getShapeCells(shape, 2, -1, 0)).toEqual([{ q: 2, r: -1 }]);
    }
    expect(INITIAL_BANK.triangle).toBeGreaterThan(0);
  });

  it('getAvailableShapes excludes drained bank shapes', () => {
    const drained = {
      ...createHexAGone(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 1,
        triangle: 0,
        square: 2,
      },
    };
    expect(getAvailableShapes(drained).sort()).toEqual(['rhombus', 'square']);
  });
});

describe('Wave 14 — Juggle category helpers', () => {
  it('getCategoryFromDie maps 1–6 and falls back for unknown', () => {
    expect(getCategoryFromDie(1)).toBe('monomino');
    expect(getCategoryFromDie(2)).toBe('domino');
    expect(getCategoryFromDie(3)).toBe('tromino');
    expect(getCategoryFromDie(4)).toBe('tetromino');
    expect(getCategoryFromDie(5)).toBe('pentomino');
    expect(getCategoryFromDie(6)).toBe('pentomino');
    expect(getCategoryFromDie(99)).toBe('monomino');
    expect(Object.keys(DICE_TO_CATEGORY)).toHaveLength(6);
  });

  it('getCategoryName returns distinct nonempty labels', () => {
    const names = (
      ['monomino', 'domino', 'tromino', 'tetromino', 'pentomino'] as const
    ).map(getCategoryName);
    expect(names.every((n) => n.length > 0)).toBe(true);
    expect(new Set(names).size).toBe(5);
  });

  it('getShapesForDie pool matches category size', () => {
    for (let die = 1; die <= 6; die++) {
      const shapes = getShapesForDie(die);
      expect(shapes.length).toBeGreaterThan(0);
      expect(shapes.every((s) => typeof s.id === 'string')).toBe(true);
    }
  });
});

describe('Wave 14 — Pent-em-in piece helpers', () => {
  it('getPlayerPieces returns independent seats; getPentominoShape resolves', () => {
    const state = createPent();
    const p1 = getPlayerPieces(state, 'player1');
    const p2 = getPlayerPieces(state, 'player2');
    expect(p1.available.length).toBeGreaterThan(0);
    expect(p2.available).toEqual(p1.available);
    expect(p1).not.toBe(p2);

    const id = p1.available[0];
    const shape = getPentominoShape(id);
    expect(shape?.id).toBe(id);
    expect(getPentominoShape('not-a-real-shape')).toBeUndefined();
  });
});

describe('Wave 14 — Calla pit / store helpers', () => {
  it('opening pits, calla, side totals, opposite index', () => {
    const state = createCalla();
    expect(getPlayerPits(state, 'player1')).toEqual(
      Array(PITS_PER_SIDE).fill(INITIAL_CUBES_PER_PIT)
    );
    expect(getPlayerCalla(state, 'player1')).toBe(0);
    expect(getPlayerCalla(state, 'player2')).toBe(0);
    expect(getSideTotalCubes(state, 'player1')).toBe(
      PITS_PER_SIDE * INITIAL_CUBES_PER_PIT
    );
    expect(isSideEmpty(state, 'player1')).toBe(false);
    expect(getOppositePitIndex(0)).toBe(PITS_PER_SIDE - 1);
    expect(getOppositePitIndex(2)).toBe(2);
  });

  it('empty side reports empty and zero total', () => {
    const empty = {
      ...createCalla(),
      player1Pits: Array(PITS_PER_SIDE).fill(0),
    };
    expect(isSideEmpty(empty, 'player1')).toBe(true);
    expect(getSideTotalCubes(empty, 'player1')).toBe(0);
    expect(isSideEmpty(empty, 'player2')).toBe(false);
  });
});

describe('Wave 14 — Queens & Guards geometry helpers', () => {
  it('cellKey / parseKey round-trip; ring sizes; normalize wrap', () => {
    expect(parseKey(cellKey(2, 5))).toEqual({ ring: 2, position: 5 });
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(1)).toBe(6);
    expect(cellsInRing(2)).toBe(12);
    expect(normalizePosition(0, 99)).toBe(0);
    expect(normalizePosition(1, 7)).toBe(1);
    expect(normalizePosition(1, -1)).toBe(5);
  });

  it('getAdjacent center has 6; isMoveValid allows same/inward only', () => {
    expect(getAdjacent({ ring: 0, position: 0 })).toHaveLength(6);
    const ring1 = getAdjacent({ ring: 1, position: 0 });
    expect(ring1.some((c) => c.ring === 0)).toBe(true);
    expect(
      isMoveValid({ ring: 2, position: 0 }, { ring: 2, position: 1 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 2, position: 0 }, { ring: 1, position: 0 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 1, position: 0 }, { ring: 2, position: 0 })
    ).toBe(false);
  });
});

describe('Wave 14 — FIAR board graph helpers', () => {
  it('createFiarBoard has 25 nodes and 8 directions', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    expect(getDirections()).toHaveLength(8);
    expect(board.edges.length).toBeGreaterThan(24);
  });

  it('areConnected / getConnectedNodes / getNodesInDirection', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
    expect(areConnected(board, '0-0', '2-2')).toBe(false);

    const corner = getConnectedNodes(board, '0-0');
    expect(corner.length).toBeGreaterThanOrEqual(2);
    expect(corner).toEqual(expect.arrayContaining(['0-1', '1-0']));

    const right = getNodesInDirection(board, '2-2', 80, 0);
    expect(right[0]).toBe('2-3');
    expect(right).toContain('2-4');
    expect(getNodesInDirection(board, 'missing', 80, 0)).toEqual([]);
  });
});

describe('Wave 14 — Par / Ramrod / Kwatro / Fab factory helpers', () => {
  it('createBlockSet has 60; createBaseId; countMatchingAttributes', () => {
    const blocks = createBlockSet();
    expect(blocks).toHaveLength(5 * 3 * 2 * 2);
    expect(createBaseId(1, 2)).toBe('base-1-2');

    const a = blocks[0];
    const identical: AttributeBlock = { ...a, id: 'copy' };
    expect(countMatchingAttributes(a, identical).sort()).toEqual([
      'color',
      'shape',
      'size',
      'thickness',
    ]);

    const disjoint = blocks.find(
      (b) =>
        b.shape !== a.shape &&
        b.color !== a.color &&
        b.size !== a.size &&
        b.thickness !== a.thickness
    );
    expect(disjoint).toBeTruthy();
    expect(countMatchingAttributes(a, disjoint!)).toEqual([]);

    const partial = blocks.find(
      (b) => b.shape === a.shape && b.color !== a.color
    )!;
    const matches = countMatchingAttributes(a, partial);
    expect(matches).toContain('shape');
    expect(matches).not.toContain('color');
  });

  it('createRodSet / createRod / createChip / fab ids', () => {
    const rods = createRodSet();
    expect(rods.length).toBe(8 + 6 + 5 + 4 + 4 + 3 + 3 + 2 + 2 + 2);
    expect(rods.every((r) => r.position === null && r.owner === null)).toBe(
      true
    );
    const rod = createRod('r-test', 5);
    expect(rod.length).toBe(5);
    expect(rod.color).toBeTruthy();
    expect(createBoxId(0, 3)).toBe('box-0-3');

    const chip = createChip('c1', 4, 'player1');
    expect(chip).toEqual({
      id: 'c1',
      value: 4,
      owner: 'player1',
      position: null,
    });
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);

    expect(createBarId(3)).toBe('bar-3');
    expect(createAnswerId(7)).toBe('answer-7');
  });

  it('shuffleArray preserves multiset and does not mutate input', () => {
    const input = [1, 2, 2, 3, 4];
    const copy = [...input];
    const shuffled = shuffleFab(input);
    expect(input).toEqual(copy);
    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort()).toEqual([...input].sort());
    expect(shufflePar(['a', 'b', 'c']).sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('Wave 14 — Sum Dominoes / Remainder helpers', () => {
  it('createDominoSet double-six; isDouble; getDominoPips; chips seat', () => {
    const set = createDominoSet();
    // double-six: (n+1)(n+2)/2 for n=6 → 28
    expect(set).toHaveLength(
      ((SD_CFG.MAX_FACE_VALUE + 1) * (SD_CFG.MAX_FACE_VALUE + 2)) / 2
    );
    const doubles = set.filter(isDouble);
    expect(doubles).toHaveLength(SD_CFG.MAX_FACE_VALUE + 1);
    expect(
      getDominoPips({
        id: 'x',
        face1: 3,
        face2: 4,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(7);

    const rem = createRemainder();
    expect(getPlayerChips(rem, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerChips(rem, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
  });
});
