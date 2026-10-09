/**
 * q-mp-298 mutation audit UI wave 9 — kill survivors in attributes/attribute-ui.
 * Structural / numeric pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { renderAttributePiece } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('attribute-styles')?.remove();
});

const piece = createPiece('p1', {
  shape: 'circle',
  color: 'red',
  size: 'small',
});

describe('mutation-ui9 attribute-ui', () => {
  it('default viewBox is 0 0 80 100 (kills L38 height-bump arith already covered by height)', () => {
    // Existing suites pin height; wave-9 locks viewBox under pure defaults.
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES);
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 100');
    expect(svg.getAttribute('height')).toBe('100');
  });

  it('viewBox omits label bump when showLabels false (kills L38 ternary 0→1)', () => {
    // Survivor: false-branch `0` → `1` in viewBox height expression.
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      showLabels: false,
      pieceSize: 80,
    });
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 80');
    expect(svg.getAttribute('height')).toBe('80');
  });

  it('viewBox omits bump when labelPosition is inside (kills L38 &&→||)', () => {
    // Survivor: showLabels && labelPosition==='below' → ||
    // With showLabels true + inside, && yields 0 bump; || would bump +20.
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      showLabels: true,
      labelPosition: 'inside',
      pieceSize: 80,
    });
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 80');
    expect(svg.getAttribute('height')).toBe('80');
  });

  it('viewBox omits bump when labelPosition is tooltip (kills L38 &&→||)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      showLabels: true,
      labelPosition: 'tooltip',
      pieceSize: 60,
    });
    expect(svg.getAttribute('viewBox')).toBe('0 0 60 60');
    expect(svg.getAttribute('height')).toBe('60');
  });
});
