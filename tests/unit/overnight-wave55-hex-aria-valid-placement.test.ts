/**
 * Wave 55 leftover after #250 — Hex interactive empty aria valid placement. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard, formatPosition } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — aria valid placement', () => {
  it('C2 empty interactive label', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el, () => undefined);
    const cell = el.querySelector('[data-row="1"][data-col="2"]');
    expect(cell?.getAttribute('aria-label')).toBe(
      `${formatPosition({ row: 1, col: 2 })}, empty, valid placement`
    );
    expect(cell?.getAttribute('aria-label')).toBe('C2, empty, valid placement');
  });
});
