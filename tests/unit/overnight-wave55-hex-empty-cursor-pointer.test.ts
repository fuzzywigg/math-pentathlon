/**
 * Wave 55 leftover after #250 — Hex empty interactive cursor pointer. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — empty cursor', () => {
  it('interactive empty cells use pointer cursor', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el, () => undefined);
    const empty = el.querySelector('.hex-cell-group') as SVGGElement | null;
    expect(empty?.style.cursor).toBe('pointer');
  });
});
