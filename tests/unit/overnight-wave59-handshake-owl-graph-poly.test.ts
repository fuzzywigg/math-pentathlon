/**
 * Overnight HEAVY leftover after #280 — handshake owl × graph × poly duals.
 * Distinct from wave58 proud/star(1)/CCW/OOB handshake. Tests-only. No engines.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import {
  stubNarrationFor,
  owlSystem,
  integrate,
  OWL_FRICTION,
} from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import {
  createTrackGraph,
  createInteractiveGraph,
  findNodesAtDistance,
  playerConnectsSets,
  type GraphBoard,
} from '../../src/core/graph';
import {
  getPlacementCells,
  validatePlacement,
  createBoard,
  SIMPLE_SHAPES,
  cellsToKey,
} from '../../src/core/polyomino';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

describe('Wave 59 handshake — owl × graph × poly', () => {
  it('howto stub + hover-leave null + placement parity + valid place', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'howto' })
    ).toMatch(/How to Play/i);

    const next = integrate({ x: 1, y: 2, vx: 4, vy: 0 });
    expect(next.vx).toBeCloseTo(4 * OWL_FRICTION);

    const graph = createTrackGraph(3);
    expect(findNodesAtDistance(graph, 't1', 1).sort()).toEqual(['t0', 't2']);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 1 }],
      ]),
    };
    expect(playerConnectsSets(board, 1, ['t0'], ['t2'])).toBe(true);

    const onHover = vi.fn();
    const el = createInteractiveGraph(board, vi.fn(), onHover);
    document.body.appendChild(el);
    const node = el.querySelector(
      'circle[data-node-id="t1"]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith(null);

    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const gridCells = getPlacementCells({
      polyomino: mono,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    });
    const legacyCells = getPlacementCells(
      {
        shapeId: 'monomino',
        position: { row: 0, col: 0 },
        rotation: 0,
        flipped: false,
      },
      SIMPLE_SHAPES
    );
    expect(cellsToKey(gridCells)).toBe(cellsToKey(legacyCells));
    expect(
      validatePlacement(createBoard(2, 2), mono, { row: 1, col: 1 }).valid
    ).toBe(true);
  });
});
