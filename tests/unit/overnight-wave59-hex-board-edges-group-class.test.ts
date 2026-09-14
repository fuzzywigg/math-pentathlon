/**
 * Wave 59 leftover after #276 — Hex board parent .hex-edges group class. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 59 hex — board edges group', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders exactly one .hex-edges with two p1 and two p2 edge children', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el);
    expect(el.querySelectorAll('.hex-edges')).toHaveLength(1);
    expect(el.querySelectorAll('.hex-edge-p1')).toHaveLength(2);
    expect(el.querySelectorAll('.hex-edge-p2')).toHaveLength(2);
  });
});
