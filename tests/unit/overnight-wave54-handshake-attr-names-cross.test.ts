/**
 * Overnight HEAVY leftover after #239 — handshake BASIC vs SET catalog names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  BASIC_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';
import {
  renderAttributePiece,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';

describe('Wave 54 handshake — attr catalogs', () => {
  it('BASIC and SET catalogs drive distinct chrome classes on the same piece factory', () => {
    const basic = renderAttributePiece(
      createPiece('b', { shape: 'circle', color: 'red', size: 'small' }),
      BASIC_ATTRIBUTES,
      { showLabels: false }
    );
    const set = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(basic.classList.contains('attribute-piece')).toBe(true);
    expect(set.classList.contains('set-card')).toBe(true);
    expect(BASIC_ATTRIBUTES.map((d) => d.name)).toEqual([
      'shape',
      'color',
      'size',
    ]);
    expect(SET_GAME_ATTRIBUTES.map((d) => d.name)).toEqual([
      'number',
      'shape',
      'shading',
      'color',
    ]);
  });
});
