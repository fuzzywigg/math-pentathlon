/**
 * Overnight HEAVY leftover after #250 — interactive board mouseleave sends null.
 * Distinct from wave35 click/hover grid math. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createBoard,
  createInteractiveBoard,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 core poly-ui — interactive mouseleave', () => {
  it('mouseleave on the svg reports a null cell', () => {
    const hovers: Array<{ row: number; col: number } | null> = [];
    const el = createInteractiveBoard(
      createBoard(3, 3),
      SIMPLE_SHAPES.slice(0, 1),
      () => undefined,
      (cell) => hovers.push(cell)
    );
    document.body.appendChild(el);
    const svg = el.querySelector('svg')!;
    svg.dispatchEvent(new Event('mouseleave'));
    expect(hovers.at(-1)).toBeNull();
  });
});
