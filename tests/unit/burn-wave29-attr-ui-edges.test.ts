/**
 * Wave 29 — attribute-ui edges (defaults, custom shape, labels, empty grid, hover).
 * Distinct from wave 21 UI smoke (card/circle/square + one grid click).
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
  SOME_SUM_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#attribute-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 29 attr-ui — renderAttributePiece config edges', () => {
  const piece = createPiece('p1', {
    shape: 'triangle',
    color: 'blue',
    size: 'large',
  });

  it('default config is card with below labels and pieceSize 80', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES);
    expect(svg.getAttribute('width')).toBe('80');
    expect(Number(svg.getAttribute('height'))).toBe(100); // 80 + 20 label
    expect(svg.querySelectorAll('rect').length).toBeGreaterThan(0);
    expect(svg.querySelectorAll('text').length).toBeGreaterThanOrEqual(2);
  });

  it('custom shape falls back to card rendering', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'custom',
      showLabels: false,
      pieceSize: 60,
    });
    expect(svg.getAttribute('width')).toBe('60');
    expect(svg.getAttribute('height')).toBe('60');
    expect(svg.querySelector('rect')).toBeTruthy();
    expect(svg.querySelector('circle')).toBeNull();
  });

  it('labelPosition inside / tooltip skip below-label height bump', () => {
    for (const labelPosition of ['inside', 'tooltip'] as const) {
      const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
        shape: 'card',
        showLabels: true,
        labelPosition,
        pieceSize: 50,
      });
      expect(svg.getAttribute('height')).toBe('50');
      // Below label text not appended when position ≠ below
      const texts = [...svg.querySelectorAll('text')].map((t) =>
        t.getAttribute('y')
      );
      expect(texts.every((y) => y !== '64')).toBe(true); // size+14 would be 64
    }
  });

  it('showLabels false omits secondary label on card and square', () => {
    const card = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
    });
    expect(card.querySelectorAll('text')).toHaveLength(1);

    const square = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'square',
      showLabels: false,
      pieceSize: 40,
    });
    expect(square.getAttribute('height')).toBe('40');
    expect(square.querySelectorAll('text')).toHaveLength(1);
  });

  it('empty definitions still paint a card background without primary text', () => {
    const svg = renderAttributePiece(piece, [], {
      shape: 'card',
      showLabels: false,
    });
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
    expect(svg.querySelector('text')).toBeNull();
  });
});

describe('Wave 29 attr-ui — renderSetCard defaults and unknown variants', () => {
  it('omitted attributes use defaults (1 oval solid red)', () => {
    const svg = renderSetCard(createPiece('bare', {}));
    expect(svg.classList.contains('set-card')).toBe(true);
    expect(svg.querySelectorAll('ellipse')).toHaveLength(1);
    const oval = svg.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('#f44336');
  });

  it('unknown shape falls back to rect; unknown color uses raw stroke', () => {
    const svg = renderSetCard(
      createPiece('u', {
        number: 2,
        shape: 'hexagon',
        shading: 'solid',
        color: '#123456',
      })
    );
    expect(svg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(3); // bg + 2 shapes
    const shapes = [...svg.querySelectorAll('rect')].slice(1);
    expect(shapes).toHaveLength(2);
    expect(shapes[0].getAttribute('fill')).toBe('#123456');
  });

  it('custom size scales viewBox height to 1.4x', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'diamond',
        shading: 'empty',
        color: 'green',
      }),
      50
    );
    expect(svg.getAttribute('width')).toBe('50');
    expect(svg.getAttribute('height')).toBe('70');
    expect(svg.getAttribute('viewBox')).toBe('0 0 50 70');
    expect(svg.querySelector('polygon')?.getAttribute('fill')).toBe('none');
  });
});

describe('Wave 29 attr-ui — createPieceGrid interaction edges', () => {
  it('empty pieces yields empty grid with no wrappers', () => {
    const grid = createPieceGrid([], BASIC_ATTRIBUTES, () => undefined);
    expect(grid.classList.contains('piece-grid')).toBe(true);
    expect(grid.querySelectorAll('.piece-wrapper')).toHaveLength(0);
  });

  it('hover styles apply only to unselected wrappers', () => {
    const pieces = [
      createPiece('a', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('b', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      () => undefined,
      new Set(['a'])
    );
    document.body.appendChild(grid);
    const wrappers = [
      ...grid.querySelectorAll('.piece-wrapper'),
    ] as HTMLElement[];

    wrappers[1].dispatchEvent(new Event('mouseenter'));
    expect(wrappers[1].style.borderColor).toBe('rgb(144, 202, 249)');
    wrappers[1].dispatchEvent(new Event('mouseleave'));
    expect(wrappers[1].style.borderColor).toBe('transparent');

    // Selected stays blue on hover enter/leave
    const selectedBorder = wrappers[0].style.borderColor;
    wrappers[0].dispatchEvent(new Event('mouseenter'));
    expect(wrappers[0].style.borderColor).toBe(selectedBorder);
    wrappers[0].dispatchEvent(new Event('mouseleave'));
    expect(wrappers[0].style.borderColor).toBe(selectedBorder);
  });

  it('onSelect fires for every wrapper including already-selected', () => {
    const pieces = [
      createPiece('a', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('b', { shape: 'square', color: 'yellow', size: 'medium' }),
    ];
    const selected: string[] = [];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      (p) => selected.push(p.id),
      new Set(['a']),
      { shape: 'circle', showLabels: false, pieceSize: 40 }
    );
    const wrappers = grid.querySelectorAll('.piece-wrapper');
    (wrappers[0] as HTMLElement).click();
    (wrappers[1] as HTMLElement).click();
    (wrappers[0] as HTMLElement).click();
    expect(selected).toEqual(['a', 'b', 'a']);
    expect(grid.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('SOME_SUM definitions drive card primary text from value attr', () => {
    const svg = renderAttributePiece(
      createPiece('ss', { value: 7, parity: 'odd', size: 'medium' }),
      SOME_SUM_ATTRIBUTES,
      { shape: 'card', showLabels: true, labelPosition: 'below' }
    );
    const texts = [...svg.querySelectorAll('text')].map((t) => t.textContent);
    expect(texts[0]).toBe('7');
    expect(texts[1]).toContain('odd');
  });
});

describe('Wave 29 attr-ui — injectAttributeStyles content contract', () => {
  it('injects highlight keyframes and set-card rules once', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    expect(css).toContain('@keyframes highlight-piece');
    expect(css).toContain('.set-card');
    expect(css).toContain('.piece-wrapper.selected');
    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
  });

  it('SET_GAME piece with color attr sets card fill from colorMap', () => {
    const svg = renderAttributePiece(
      createPiece('set', {
        number: 2,
        shape: 'oval',
        shading: 'striped',
        color: 'green',
      }),
      SET_GAME_ATTRIBUTES,
      { shape: 'card', showLabels: false }
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#4caf50');
  });
});
