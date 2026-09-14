/**
 * Overnight HEAVY leftover after #239 — handshake attribute-ui barrel exports. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as attrUi from '../../src/core/attributes/attribute-ui';
import * as attrIndex from '../../src/core/attributes';

describe('Wave 54 handshake — attr ui exports', () => {
  it('re-exports render/grid/inject from the attributes barrel', () => {
    expect(attrIndex.renderAttributePiece).toBe(attrUi.renderAttributePiece);
    expect(attrIndex.renderSetCard).toBe(attrUi.renderSetCard);
    expect(attrIndex.createPieceGrid).toBe(attrUi.createPieceGrid);
    expect(attrIndex.injectAttributeStyles).toBe(attrUi.injectAttributeStyles);
  });
});
