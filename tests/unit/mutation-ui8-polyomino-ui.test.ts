/**
 * q-mp-272 mutation audit UI wave 8 — kill survivors in polyomino/polyomino-ui.
 * Structural / numeric pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';
import {
  renderBoard,
  renderPolyomino,
} from '../../src/core/polyomino/polyomino-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const trominoL = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('mutation-ui8 polyomino-ui', () => {
  it('DEFAULT_CONFIG cellSize 30 + padding 2 size the SVG (kills L20/L21 ±1)', () => {
    // Survivors: cellSize 30→31/29, padding 2→3/1 when no config override.
    const svg = renderPolyomino(mono);
    // width = 1*30 + 2*2 = 34; height same
    expect(svg.getAttribute('width')).toBe('34');
    expect(svg.getAttribute('height')).toBe('34');
    expect(svg.getAttribute('viewBox')).toBe('0 0 34 34');
  });

  it('default flipped=false matches explicit false for tromino-L (kills L44 false→true)', () => {
    // Survivor: flipped default false → true.
    const def = renderPolyomino(trominoL);
    const unflipped = renderPolyomino(trominoL, 0, false);
    const flipped = renderPolyomino(trominoL, 0, true);
    const xs = (svg: SVGSVGElement) =>
      [...svg.querySelectorAll('rect')]
        .map((r) => r.getAttribute('x'))
        .join(',');
    expect(xs(def)).toBe(xs(unflipped));
    expect(xs(def)).not.toBe(xs(flipped));
  });

  it('cell rect x uses (col-minCol)*cellSize+padding then +1 (kills L60 arith)', () => {
    // Survivors: L60 flip +→- / *→/ / -→+ on x = (col-minCol)*cellSize+padding.
    // Monomino (col=0) masks *→/ and -→+; tromino-L has col=1.
    const svg = renderPolyomino(trominoL, 0, false, {
      cellSize: 30,
      padding: 2,
    });
    const xs = [...svg.querySelectorAll('rect')].map((r) =>
      Number(r.getAttribute('x'))
    );
    // cells (0,0)/(1,0)/(1,1) → rect x values 3, 3, 33 (= col*30+2+1)
    expect(xs.sort((a, b) => a - b)).toEqual([3, 3, 33]);
  });

  it('default board render still paints data-row/col grid cells', () => {
    // Note: showGrid DEFAULT true→false is unread in product code — documented
    // survivor. This pin locks grid cell dataset presence under defaults.
    const board = createBoard(2, 2);
    const svg = renderBoard(board, [], { cellSize: 10, padding: 0 });
    expect(svg.querySelectorAll('[data-row][data-col]')).toHaveLength(4);
  });
});
