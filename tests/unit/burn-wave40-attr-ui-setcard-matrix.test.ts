/**
 * Wave 40 — attr-ui setcard matrix count/shape/fill + unknown color leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderSetCard } from '../../src/core/attributes/attribute-ui';
import { createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 40 attr-ui — setcard matrix', () => {
  it('count matrix: number 1/2/3 yields that many shapes', () => {
    for (const count of [1, 2, 3] as const) {
      const svg = renderSetCard(
        createPiece(`n${count}`, {
          number: count,
          shape: 'oval',
          shading: 'solid',
          color: 'red',
        })
      );
      expect(svg.querySelectorAll('ellipse')).toHaveLength(count);
    }
  });

  it('shape matrix: oval / diamond / squiggle element tags', () => {
    const oval = renderSetCard(
      createPiece('o', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: 'green',
      })
    );
    expect(oval.querySelector('ellipse')).toBeTruthy();

    const diamond = renderSetCard(
      createPiece('d', {
        number: 1,
        shape: 'diamond',
        shading: 'solid',
        color: 'purple',
      })
    );
    expect(diamond.querySelector('polygon')).toBeTruthy();

    const squiggle = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'squiggle',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(squiggle.querySelector('path')).toBeTruthy();
  });

  it('fill/shading matrix: solid / empty / striped', () => {
    const solid = renderSetCard(
      createPiece('sol', {
        number: 1,
        shape: 'diamond',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(solid.querySelector('polygon')?.getAttribute('fill')).toBe(
      '#f44336'
    );

    const empty = renderSetCard(
      createPiece('emp', {
        number: 1,
        shape: 'oval',
        shading: 'empty',
        color: 'green',
      })
    );
    expect(empty.querySelector('ellipse')?.getAttribute('fill')).toBe('none');

    const striped = renderSetCard(
      createPiece('str', {
        number: 1,
        shape: 'oval',
        shading: 'striped',
        color: 'purple',
      })
    );
    expect(striped.querySelector('defs')).toBeTruthy();
    expect(
      striped.querySelector('ellipse')?.getAttribute('fill')?.startsWith('url(')
    ).toBe(true);
  });

  it('unknown color uses raw string as stroke/fill', () => {
    const svg = renderSetCard(
      createPiece('raw', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: '#abcdef',
      })
    );
    expect(svg.querySelector('ellipse')?.getAttribute('fill')).toBe('#abcdef');
  });

  it('unknown shape falls back to rect shapes', () => {
    const svg = renderSetCard(
      createPiece('hex', {
        number: 2,
        shape: 'hexagon',
        shading: 'solid',
        color: 'red',
      })
    );
    // background card rect + 2 shape rects
    expect(svg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(3);
  });
});
