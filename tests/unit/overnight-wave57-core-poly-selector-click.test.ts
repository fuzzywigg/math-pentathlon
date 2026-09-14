/**
 * Overnight HEAVY leftover after #264 — createShapeSelector click selects shape.
 * Distinct from wave53 hover border styles. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createShapeSelector, SIMPLE_SHAPES } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core poly-ui — selector click', () => {
  it('clicking an option invokes onSelect with shape', () => {
    const onSelect = vi.fn();
    const el = createShapeSelector(SIMPLE_SHAPES.slice(0, 2), onSelect);
    document.body.appendChild(el);
    const option = el.querySelector('.shape-option') as HTMLElement;
    option.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].id).toBe('monomino');
  });
});
