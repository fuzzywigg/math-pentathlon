/**
 * Wave 63 leftover after #301 — Hex board .hex-cells / .hex-labels groups. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 63 hex — board cells/labels groups', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders one .hex-cells and one .hex-labels group', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el);
    expect(el.querySelectorAll('.hex-cells')).toHaveLength(1);
    expect(el.querySelectorAll('.hex-labels')).toHaveLength(1);
  });
});
