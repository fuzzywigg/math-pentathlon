/**
 * Wave 60 leftover after #290 (unit-only) — Attr selected-info idle placeholder.
 * Distinct from wave59 Piece 1 / Select pieces compare leftovers. Tests-only.
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

describe('Wave 60 demos — attr click-piece placeholder', () => {
  it('math set switch restores Click a piece placeholder', () => {
    const root = mount();
    renderAttributeDemo(root);
    const mathBtn = [...root.querySelectorAll('.attribute-set-selector .set-btn')].find(
      (el) => (el as HTMLElement).dataset.set === 'math'
    ) as HTMLButtonElement;
    expect(mathBtn).toBeTruthy();
    mathBtn.click();
    expect(root.querySelector('#selected-info .placeholder')?.textContent).toBe(
      'Click a piece to see its attributes'
    );
  });
});
