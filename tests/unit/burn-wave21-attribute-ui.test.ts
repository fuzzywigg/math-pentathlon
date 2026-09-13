/**
 * Wave 21 — attribute-ui DOM contracts (piece / SET card / grid / styles).
 * Distinct from secondary-ui waves and #121 history-status-DOM.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
  injectAttributeStyles,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#attribute-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 21 attribute-ui — renderAttributePiece shapes', () => {
  const piece = createPiece('p1', {
    shape: 'circle',
    color: 'red',
    size: 'small',
  });

  it('card shape stamps dataset + primary text', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: true,
      labelPosition: 'below',
    });
    expect(svg.classList.contains('attribute-piece')).toBe(true);
    expect(svg.dataset.pieceId).toBe('p1');
    expect(svg.querySelectorAll('rect').length).toBeGreaterThan(0);
    expect(svg.querySelector('text')?.textContent).toBeTruthy();
  });

  it('circle and square shapes remount independently', () => {
    const circle = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'circle',
      showLabels: false,
    });
    const square = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'square',
      showLabels: true,
      labelPosition: 'below',
    });
    expect(circle.querySelector('circle')).toBeTruthy();
    expect(square.querySelector('rect')).toBeTruthy();
    document.body.appendChild(circle);
    document.body.appendChild(square);
    expect(document.querySelectorAll('.attribute-piece')).toHaveLength(2);
  });
});

describe('Wave 21 attribute-ui — renderSetCard shading variants', () => {
  it('renders count shapes for solid / empty / striped', () => {
    const solid = renderSetCard(
      createPiece('s', {
        number: 2,
        shape: 'diamond',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(solid.classList.contains('set-card')).toBe(true);
    expect(solid.querySelectorAll('polygon').length).toBe(2);

    const empty = renderSetCard(
      createPiece('e', {
        number: 1,
        shape: 'oval',
        shading: 'empty',
        color: 'green',
      })
    );
    const oval = empty.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('none');

    const striped = renderSetCard(
      createPiece('st', {
        number: 3,
        shape: 'squiggle',
        shading: 'striped',
        color: 'purple',
      })
    );
    expect(striped.querySelector('defs')).toBeTruthy();
    expect(striped.querySelectorAll('path').length).toBe(3);
  });
});

describe('Wave 21 attribute-ui — createPieceGrid + inject styles', () => {
  it('grid length matches pieces and click selects', () => {
    const pieces = [
      createPiece('a', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('b', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const selected: string[] = [];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      (p) => selected.push(p.id),
      new Set(['a'])
    );
    expect(grid.classList.contains('piece-grid')).toBe(true);
    expect(grid.querySelectorAll('.piece-wrapper')).toHaveLength(2);
    expect(grid.querySelector('.piece-wrapper.selected')).toBeTruthy();

    const wrappers = grid.querySelectorAll('.piece-wrapper');
    (wrappers[1] as HTMLElement).click();
    expect(selected).toEqual(['b']);
  });

  it('injectAttributeStyles is idempotent', () => {
    injectAttributeStyles();
    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
    expect(document.getElementById('attribute-styles')?.textContent).toContain(
      'attribute-piece'
    );
  });

  it('SET_GAME_ATTRIBUTES colorMap feeds piece fill via definitions', () => {
    const svg = renderAttributePiece(
      createPiece('set1', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: 'red',
      }),
      SET_GAME_ATTRIBUTES,
      { shape: 'card', showLabels: false }
    );
    const rect = svg.querySelector('rect');
    expect(rect?.getAttribute('fill')).toBeTruthy();
  });
});
