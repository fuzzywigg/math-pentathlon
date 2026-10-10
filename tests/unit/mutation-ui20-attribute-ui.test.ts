/**
 * q-mp-569 mutation audit UI wave 20 — attribute-ui first-20 re-pins.
 * Structural / numeric / boolean pins only — no player-facing copy asserts.
 *
 * Orthogonal to open soft-fail char `#1025` (`q-mp-571-*`); this suite stays on
 * happy-path DEFAULT_CONFIG / viewBox / card chrome pins only.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { renderAttributePiece } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('attribute-styles')?.remove();
});

const piece = createPiece('w20', {
  shape: 'circle',
  color: 'red',
  size: 'small',
});

describe('mutation-ui20 attribute-ui', () => {
  it('DEFAULT_CONFIG showLabels true bumps height by 20 (kills L14 true→false)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES);
    expect(svg.getAttribute('height')).toBe('100');
    expect(svg.getAttribute('width')).toBe('80');
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 100');
  });

  it('showLabels false keeps height equal to pieceSize (kills L34/L38 && / === / ±1)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      showLabels: false,
      pieceSize: 80,
    });
    expect(svg.getAttribute('height')).toBe('80');
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 80');
  });

  it('labelPosition inside omits below bump (kills L34/L38 &&→||)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      showLabels: true,
      labelPosition: 'inside',
      pieceSize: 64,
    });
    expect(svg.getAttribute('height')).toBe('64');
    expect(svg.getAttribute('viewBox')).toBe('0 0 64 64');
  });

  it('card rect insets by 4 and uses rx 8 (kills L92/L93 arithmetic / ±1)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
      pieceSize: 80,
    });
    const rect = svg.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute('x')).toBe('2');
    expect(rect!.getAttribute('y')).toBe('2');
    expect(rect!.getAttribute('width')).toBe('76');
    expect(rect!.getAttribute('height')).toBe('76');
    expect(rect!.getAttribute('rx')).toBe('8');
  });

  it('color attribute name sets card fill from colorMap (kills L54 || / ===)', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
      pieceSize: 80,
    });
    const rect = svg.querySelector('rect');
    expect(rect!.getAttribute('fill')).toBeTruthy();
    // Missing color defs would leave the default gray fill.
    expect(rect!.getAttribute('fill')).not.toBe('#e0e0e0');
  });

  it('missing attribute values skip color assignment (kills L49 ===→!==)', () => {
    const sparse = createPiece('sparse', { shape: 'circle' });
    const svg = renderAttributePiece(sparse, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
      pieceSize: 40,
    });
    const rect = svg.querySelector('rect');
    expect(rect!.getAttribute('fill')).toBe('#e0e0e0');
    expect(svg.dataset.pieceId).toBe('sparse');
  });
});
