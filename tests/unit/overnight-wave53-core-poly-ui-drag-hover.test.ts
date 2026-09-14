/**
 * Overnight HEAVY leftover after #241 — createDraggableShape hover scale.
 * Distinct from wave23 dragstart payload. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createDraggableShape, SIMPLE_SHAPES } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 53 core poly-ui — draggable hover scale', () => {
  it('mouseenter scales up; mouseleave restores', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const el = createDraggableShape(mono, 0, false);
    document.body.appendChild(el);
    el.dispatchEvent(new Event('mouseenter'));
    expect(el.style.transform).toBe('scale(1.05)');
    el.dispatchEvent(new Event('mouseleave'));
    expect(el.style.transform).toBe('scale(1)');
  });
});
