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

describe('Wave 54 attr — inject selected shadow', () => {
  it('uses rgba(33, 150, 243, 0.4) box-shadow on selected wrappers', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    expect(css).toContain('box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4)');
  });
});
