/**
 * Overnight HEAVY leftover after #264 — dragstart fades opacity to 0.5.
 * Distinct from wave56 dataset-only assert. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createDraggableShape, TETROMINOES } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core poly-ui — dragstart opacity', () => {
  it('dragstart fades shape; dragend restores', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const el = createDraggableShape(T, 180, true);
    document.body.appendChild(el);
    el.dispatchEvent(new Event('dragstart', { bubbles: true }));
    expect(el.style.opacity).toBe('0.5');
    el.dispatchEvent(new Event('dragend', { bubbles: true }));
    expect(el.style.opacity).toBe('1');
    expect(el.dataset.shapeId).toBe('T');
    expect(el.dataset.rotation).toBe('180');
    expect(el.dataset.flipped).toBe('true');
  });
});
