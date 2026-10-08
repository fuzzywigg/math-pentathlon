/**
 * burn-1008-mp-ui-coverage-round-4 — FIAR layout edge helpers + board-ui
 * ellipse / synthetic-id paths. Tests-only; no player-facing copy asserts.
 */
import { describe, expect, it } from 'vitest';
import {
  countConfirmedEdges,
  createVerifiedProductionLayout,
  createYellowCenterTestLayout,
  parseNodeId,
  nodeId,
  edgeKey,
} from '../../src/games/fiar/layout';
import {
  createInitialState,
  createBoardFromLayout,
} from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { installDomHooks } from './helpers/dom';

describe('burn-1008 ui-cov-r4 fiar layout', () => {
  it('parseNodeId rejects non-grid ids; nodeId / edgeKey are stable', () => {
    expect(parseNodeId('not-a-node')).toBeNull();
    expect(parseNodeId('c3r2')).toEqual({ col: 3, row: 2 });
    expect(nodeId(4, 1)).toBe('c4r1');
    expect(edgeKey('c1r0', 'c0r0')).toBe(edgeKey('c0r0', 'c1r0'));
  });

  it('createVerifiedProductionLayout can include diamond-border edges', () => {
    const base = createVerifiedProductionLayout();
    const withDiamond = createVerifiedProductionLayout({
      includeDiamondBorderEdges: true,
    });
    expect(base.includeDiamondBorderEdges).toBe(false);
    expect(withDiamond.includeDiamondBorderEdges).toBe(true);
    expect(withDiamond.edges.length).toBeGreaterThan(base.edges.length);
    expect(withDiamond.yellowCenter?.kind).toBe('diamond');
    expect(countConfirmedEdges()).toBe(base.edges.length);
  });

  it('createYellowCenterTestLayout exposes ellipse yellow center', () => {
    const layout = createYellowCenterTestLayout();
    expect(layout.yellowCenter?.kind).toBe('ellipse');
    expect(layout.nodes.length).toBe(6);
    expect(layout.edges.some((e) => e.crossesYellowCenter)).toBe(true);
  });
});

describe('burn-1008 ui-cov-r4 fiar board-ui ellipse + synthetic ids', () => {
  installDomHooks();

  it('renders ellipse yellow center with unverified marker; synthetic node a11y attrs', () => {
    const layout = createYellowCenterTestLayout();
    // Force unverified so ellipse path sets data-layout-unverified
    const unverified = { ...layout, verified: false };
    const state = createInitialState({ layout: unverified });
    expect(state.board.yellowCenter?.kind).toBe('ellipse');
    expect(state.board.layoutVerified).toBe(false);

    const svg = renderBoard(state, () => undefined);
    const ellipse = svg.querySelector('[data-yellow-shape="ellipse"]');
    expect(ellipse).toBeTruthy();
    expect(ellipse?.getAttribute('data-layout-unverified')).toBe('1');

    const syn = svg.querySelector('[data-node-id="a"]');
    expect(syn).toBeTruthy();
    expect(syn?.getAttribute('data-row')).toBe('0');
    expect(syn?.getAttribute('data-col')).toBe('a');

    const dashed = svg.querySelector('[data-crosses-yellow="1"]');
    expect(dashed).toBeTruthy();
  });

  it('diamond layoutVerified marker when production layout is verified', () => {
    const state = createInitialState();
    const svg = renderBoard(state, () => undefined);
    const diamond = svg.querySelector('[data-yellow-shape="diamond"]');
    expect(diamond).toBeTruthy();
    expect(diamond?.getAttribute('data-layout-verified')).toBe('1');
  });

  it('createBoardFromLayout preserves yellowCrossingKeys for fixture', () => {
    const board = createBoardFromLayout(createYellowCenterTestLayout());
    expect(board.yellowCrossingKeys.size).toBeGreaterThan(0);
  });
});
