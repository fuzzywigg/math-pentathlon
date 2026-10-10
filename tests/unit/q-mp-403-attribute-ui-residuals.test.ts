/**
 * q-mp-403 — Characterize attribute-ui soft-fail / empty-board / render residuals.
 *
 * Tests only. Structural asserts (element kinds, counts, dataset ids, fill/stroke
 * presence, callback counts). No player-facing copy pins.
 *
 * Orthogonal to tip `engine-coverage-round-12` (#876 fold) which pinned
 * missing-attr continue / glossy shading default / custom→card / hover borders.
 * This suite owns the remaining branch residuals (empty defs on circle/square,
 * sparse secondary label skip) plus empty-board / soft-default render edges.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createPieceGrid,
  injectAttributeStyles,
  renderAttributePiece,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  createPiece,
  type AttributeDefinition,
} from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#attribute-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('q-mp-403 attribute-ui — empty-definition render soft-fail', () => {
  it('circle with empty definitions paints chrome without primary text', () => {
    // L167 false: primaryAttr absent → skip center text; circle still mounts.
    const svg = renderAttributePiece(
      createPiece('empty-circ', { shape: 'circle', color: 'red' }),
      [],
      { shape: 'circle', showLabels: false, pieceSize: 48 }
    );
    expect(svg.dataset.pieceId).toBe('empty-circ');
    expect(svg.querySelector('circle')).toBeTruthy();
    expect(svg.querySelector('text')).toBeNull();
    expect(svg.querySelector('circle')?.getAttribute('fill')).toBe('#e0e0e0');
  });

  it('square with empty definitions paints chrome without primary text', () => {
    // L204 false: primaryAttr absent → skip center text; square rect still mounts.
    const svg = renderAttributePiece(
      createPiece('empty-sq', { shape: 'square', color: 'blue' }),
      [],
      { shape: 'square', showLabels: false, pieceSize: 48 }
    );
    expect(svg.dataset.pieceId).toBe('empty-sq');
    expect(svg.querySelector('rect')).toBeTruthy();
    expect(svg.querySelector('text')).toBeNull();
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
  });
});

describe('q-mp-403 attribute-ui — sparse secondary label residual', () => {
  it('card below-labels skip missing secondary attributes without throwing', () => {
    // L132 false: definitions.slice(1,3) includes names absent on the piece.
    const defs: AttributeDefinition[] = [
      {
        name: 'shape',
        possibleValues: ['circle', 'square'],
        colorMap: { circle: '#111', square: '#222' },
      },
      {
        name: 'color',
        possibleValues: ['red', 'blue'],
        colorMap: { red: '#f00', blue: '#00f' },
      },
      {
        name: 'size',
        possibleValues: ['small', 'large'],
      },
    ];
    // Primary shape present; color + size intentionally omitted.
    const piece = createPiece('sparse-label', { shape: 'circle' });
    const svg = renderAttributePiece(piece, defs, {
      shape: 'card',
      showLabels: true,
      labelPosition: 'below',
      pieceSize: 60,
    });
    const texts = [...svg.querySelectorAll('text')];
    expect(texts.length).toBeGreaterThanOrEqual(2);
    // Primary text still renders; secondary label node exists but stays empty.
    expect(texts[0]?.textContent).toBe('circle');
    const label = texts[texts.length - 1];
    expect(label?.getAttribute('y')).toBe('74'); // size + 14
    expect(label?.textContent).toBe('');
  });
});

describe('q-mp-403 attribute-ui — empty-board / soft-default edges', () => {
  it('empty piece list yields empty grid shell with no wrappers', () => {
    const grid = createPieceGrid([], BASIC_ATTRIBUTES, () => undefined);
    expect(grid.classList.contains('piece-grid')).toBe(true);
    expect(grid.querySelectorAll('.piece-wrapper')).toHaveLength(0);
    expect(grid.children).toHaveLength(0);
  });

  it('empty definitions on a non-empty grid still mounts wrappers and fires select', () => {
    const pieces = [
      createPiece('a', { shape: 'circle' }),
      createPiece('b', { shape: 'square' }),
    ];
    const selected: string[] = [];
    const grid = createPieceGrid(
      pieces,
      [],
      (p) => selected.push(p.id),
      new Set(),
      {
        shape: 'card',
        showLabels: false,
        pieceSize: 40,
      }
    );
    document.body.appendChild(grid);
    const wrappers = grid.querySelectorAll('.piece-wrapper');
    expect(wrappers).toHaveLength(2);
    // Soft default fill when no colorMap definitions resolve.
    expect(wrappers[0]?.querySelector('rect')?.getAttribute('fill')).toBe(
      '#e0e0e0'
    );
    (wrappers[1] as HTMLElement).click();
    expect(selected).toEqual(['b']);
  });

  it('SET card falsy number 0 soft-defaults to a single shape', () => {
    // `(number as number) || 1` — 0 is falsy and collapses to one oval.
    const svg = renderSetCard(
      createPiece('n0', {
        number: 0,
        shape: 'oval',
        shading: 'solid',
        color: 'green',
      })
    );
    expect(svg.classList.contains('set-card')).toBe(true);
    expect(svg.querySelectorAll('ellipse')).toHaveLength(1);
    expect(svg.querySelector('ellipse')?.getAttribute('fill')).toBe('#4caf50');
  });

  it('SET card empty shading soft-defaults to solid fill', () => {
    // `(shading as string) || 'solid'` when shading is ''.
    const svg = renderSetCard(
      createPiece('shade-empty', {
        number: 1,
        shape: 'diamond',
        shading: '',
        color: 'purple',
      })
    );
    const diamond = svg.querySelector('polygon');
    expect(diamond).toBeTruthy();
    expect(diamond?.getAttribute('fill')).toBe('#9c27b0');
    expect(diamond?.getAttribute('stroke')).toBe('#9c27b0');
  });

  it('non-color attribute colorMap paints circle stroke (shapeColor path)', () => {
    const defs: AttributeDefinition[] = [
      {
        name: 'value',
        possibleValues: [1, 2],
      },
      {
        name: 'parity',
        possibleValues: ['odd', 'even'],
        colorMap: { odd: '#2196f3', even: '#f44336' },
      },
    ];
    const svg = renderAttributePiece(
      createPiece('parity-circ', { value: 1, parity: 'odd' }),
      defs,
      { shape: 'circle', showLabels: false, pieceSize: 50 }
    );
    const circle = svg.querySelector('circle');
    expect(circle?.getAttribute('fill')).toBe('#e0e0e0');
    expect(circle?.getAttribute('stroke')).toBe('#2196f3');
  });

  it('injectAttributeStyles early-returns when style node already present', () => {
    injectAttributeStyles();
    const first = document.getElementById('attribute-styles');
    expect(first).toBeTruthy();
    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
    expect(document.getElementById('attribute-styles')).toBe(first);
  });
});
