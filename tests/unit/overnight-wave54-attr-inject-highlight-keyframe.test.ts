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

describe('Wave 54 attr — inject highlight timing', () => {
  it('animates highlight-piece for 0.5s ease-in-out', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    expect(css).toContain('animation: highlight-piece 0.5s ease-in-out');
    expect(css).toContain('50% { transform: scale(1.1); }');
  });
});
