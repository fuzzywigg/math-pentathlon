/**
 * Wave 39 — createPieceGrid selection toggle + injectAttributeStyles.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createPieceGrid,
  injectAttributeStyles,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#attribute-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 39 attr — grid select UI', () => {
  it('selectedIds marks wrapper; click forwards piece', () => {
    const pieces = [
      createPiece('p1', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('p2', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const onSelect = vi.fn();
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      onSelect,
      new Set(['p2'])
    );
    document.body.appendChild(grid);
    expect(grid.querySelectorAll('.piece-wrapper')).toHaveLength(2);
    expect(grid.querySelector('.piece-wrapper.selected')?.querySelector('svg')?.dataset.pieceId).toBe('p2');
    (grid.querySelector('.piece-wrapper') as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(pieces[0]);
  });

  it('injectAttributeStyles idempotent; renderSetCard mounts', () => {
    injectAttributeStyles();
    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
    const card = renderSetCard(
      createPiece('set1', {
        number: 2,
        color: 'red',
        shading: 'striped',
        shape: 'diamond',
      })
    );
    expect(card.classList.contains('set-card')).toBe(true);
    void SET_GAME_ATTRIBUTES;
  });
});
