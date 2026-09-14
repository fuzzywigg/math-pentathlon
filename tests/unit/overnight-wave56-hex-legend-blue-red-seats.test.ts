/**
 * Wave 56 leftover after #256 — Hex HvH legend Blue/Red seats. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — HvH legend', () => {
  it('Blue Top↔Bottom and Red Left↔Right', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-human');
    expect(el.querySelector('.hex-legend-p1')?.textContent).toMatch(
      /Blue: Top ↔ Bottom/
    );
    expect(el.querySelector('.hex-legend-p2')?.textContent).toMatch(
      /Red: Left ↔ Right/
    );
  });
});
