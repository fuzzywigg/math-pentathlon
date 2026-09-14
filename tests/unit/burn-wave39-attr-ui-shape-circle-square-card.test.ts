/**
 * Wave 39 — attributes UI shape render leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
  BASIC_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes';

describe('Wave 39 attributes — UI shapes', () => {
  const piece = createPiece('p1', { color: 'red', shape: 'circle' });

  it('renderAttributePiece card/circle/square', () => {
    for (const shape of ['card', 'circle', 'square'] as const) {
      const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
        shape,
        showLabels: true,
        labelPosition: 'below',
      });
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.dataset.pieceId).toBe('p1');
    }
  });

  it('renderSetCard returns svg', () => {
    const card = renderSetCard(piece, 80);
    expect(card.tagName.toLowerCase()).toBe('svg');
    expect(card.classList.contains('set-card')).toBe(true);
  });

  it('createPieceGrid mounts children', () => {
    const pieces = [
      createPiece('a', { color: 'red' }),
      createPiece('b', { color: 'blue' }),
    ];
    const grid = createPieceGrid(pieces, BASIC_ATTRIBUTES, () => {});
    expect(grid.children.length).toBe(2);
  });
});
