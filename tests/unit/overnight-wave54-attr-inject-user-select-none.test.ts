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

describe('Wave 54 attr — inject user-select', () => {
  it('disables text selection on .piece-grid', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    expect(css).toContain('.piece-grid {');
    expect(css).toContain('user-select: none');
  });
});
