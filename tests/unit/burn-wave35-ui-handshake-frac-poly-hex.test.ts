/**
 * Wave 35 — cross-module UI handshake (frac × poly × hex leftovers).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderFractionBar,
  createInteractiveFractionBar,
  injectFractionBarStyles,
} from '../../src/core/fractions';
import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderBoard,
  renderPlacementPreview,
  injectPolyominoStyles,
} from '../../src/core/polyomino';
import {
  renderHexGrid,
  renderRectHexGrid,
  createInteractiveHexGrid,
  injectHexStyles,
  type HexLayout,
} from '../../src/core/hex';

const layout: HexLayout = {
  orientation: 'pointy',
  size: 10,
  origin: { x: 0, y: 0 },
};

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-bar-styles')?.remove();
  document.getElementById('polyomino-styles')?.remove();
});

describe('Wave 35 ui-handshake — style inject trio', () => {
  it('all three style injectors coexist with unique ids', () => {
    injectFractionBarStyles();
    injectPolyominoStyles();
    injectHexStyles();
    expect(document.getElementById('fraction-bar-styles')).toBeTruthy();
    expect(document.getElementById('polyomino-styles')).toBeTruthy();
    // hex styles have no id — just ensure call is safe after poly/frac
    expect(document.head.querySelectorAll('style').length).toBeGreaterThanOrEqual(
      2
    );
  });
});

describe('Wave 35 ui-handshake — montage render surface', () => {
  it('fraction + poly board + hex grid mount into one host', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    host.appendChild(
      renderFractionBar(
        { numerator: 3, denominator: 8 },
        { style: 'circle', showLabel: true }
      )
    );

    let board = createBoard(3, 3);
    const mono = SIMPLE_SHAPES[0];
    board = placePolyomino(board, mono, { row: 1, col: 1 });
    const boardSvg = renderBoard(board, [mono], { cellSize: 12, padding: 1 });
    const preview = renderPlacementPreview(
      board,
      SIMPLE_SHAPES[1],
      { row: 0, col: 0 },
      0,
      false
    );
    boardSvg.appendChild(preview);
    host.appendChild(boardSvg);

    host.appendChild(renderHexGrid(1, layout, { showCoords: true }));
    host.appendChild(renderRectHexGrid(2, 2, layout));

    const interactive = document.createElement('div');
    host.appendChild(interactive);
    createInteractiveHexGrid(interactive, 0, layout);

    const fracBar = createInteractiveFractionBar(
      { numerator: 1, denominator: 4 },
      4,
      () => {}
    );
    host.appendChild(fracBar);

    expect(host.querySelectorAll('svg').length).toBeGreaterThanOrEqual(4);
    expect(host.querySelectorAll('.hex-cell').length).toBeGreaterThanOrEqual(8);
    expect(host.querySelectorAll('.fraction-segment')).toHaveLength(4);
    expect(host.querySelector('.placement-preview')).toBeTruthy();
  });
});
