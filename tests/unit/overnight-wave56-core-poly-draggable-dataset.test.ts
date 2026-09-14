/**
 * Overnight HEAVY leftover after #256 — createDraggableShape dataset payload.
 * Distinct from wave53 hover scale. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createDraggableShape, TETROMINOES } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core poly-ui — draggable dataset', () => {
  it('dataset records shapeId rotation flipped', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    const el = createDraggableShape(L, 90, true);
    document.body.appendChild(el);
    expect(el.classList.contains('draggable-shape')).toBe(true);
    expect(el.draggable).toBe(true);
    expect(el.dataset.shapeId).toBe('L');
    expect(el.dataset.rotation).toBe('90');
    expect(el.dataset.flipped).toBe('true');
    expect(el.querySelector('svg')).toBeTruthy();
  });
});
