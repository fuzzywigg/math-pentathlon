/**
 * Overnight HEAVY leftover after #239 — core/attributes exact chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
  injectAttributeStyles,
} from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('attribute-styles')?.remove();
});

describe('Wave 54 attr — unselected wrapper', () => {
  it('gives unselected wrappers 3px transparent border and pointer cursor', () => {
    const grid = createPieceGrid(
      [createPiece('a', { shape: 'circle', color: 'red', size: 'small' })],
      BASIC_ATTRIBUTES,
      () => undefined
    );
    const w = grid.querySelector('.piece-wrapper') as HTMLElement;
    expect(w.classList.contains('selected')).toBe(false);
    expect(w.style.cursor).toBe('pointer');
    expect(w.style.padding).toBe('4px');
    expect(w.style.borderWidth).toBe('3px');
    expect(w.style.borderStyle).toBe('solid');
    expect(w.style.borderColor).toBe('transparent');
  });
});
