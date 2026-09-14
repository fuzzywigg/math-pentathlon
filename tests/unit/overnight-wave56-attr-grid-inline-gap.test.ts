/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr piece-wrapper selected border leftover. Tests-only.
 * (jsdom drops createPieceGrid root cssText containing gap; assert wrapper chrome instead.)
 */
import { describe, it, expect } from 'vitest';
import { createPieceGrid } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — grid wrapper chrome', () => {
  it('unselected wrapper pointer padding border leftover', () => {
    const el = createPieceGrid(
      [createPiece('a', { shape: 'circle', color: 'blue' })],
      BASIC_ATTRIBUTES,
      () => undefined
    );
    const wrap = el.querySelector('.piece-wrapper') as HTMLElement;
    expect(wrap.style.cursor).toBe('pointer');
    expect(wrap.style.padding).toBe('4px');
    expect(wrap.getAttribute('style')).toContain('border: 3px solid transparent');
  });
});
