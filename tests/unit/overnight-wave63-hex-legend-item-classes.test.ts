/**
 * Wave 63 leftover after #301 — Hex legend-item class mount residual. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

describe('Wave 63 hex — legend item classes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('status mounts hex-legend-item p1/p2 spans', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-human');
    expect(el.querySelectorAll('.hex-legend-item')).toHaveLength(2);
    expect(el.querySelector('.hex-legend-item.hex-legend-p1')).toBeTruthy();
    expect(el.querySelector('.hex-legend-item.hex-legend-p2')).toBeTruthy();
  });
});
