/**
 * Wave 64 leftover after tip/#303 (unit-only) — attr set data attrs.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 64 demos — attr set-btn data-set attrs', () => {
  it('locks basic/math data-set attrs + basic selected idle', () => {
    const root = mount();
    renderAttributeDemo(root);
    const btns = [
      ...root.querySelectorAll('.attribute-set-selector .set-btn'),
    ];
    expect(btns.map((b) => b.getAttribute('data-set'))).toEqual([
      'basic',
      'math',
    ]);
    expect(btns[0].classList.contains('selected')).toBe(true);
    expect(btns[1].classList.contains('selected')).toBe(false);
  });
});
