/**
 * Wave 60 leftover after #290 (unit-only) — Attr basic set-btn.selected mount.
 * Distinct from wave58 Basic/Math labels leftover. Tests-only.
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

describe('Wave 60 demos — attr basic selected class', () => {
  it('Basic set-btn starts selected; Math click swaps selected', () => {
    const root = mount();
    renderAttributeDemo(root);
    const basic = root.querySelector(
      '.attribute-set-selector .set-btn[data-set="basic"]'
    ) as HTMLButtonElement;
    const math = root.querySelector(
      '.attribute-set-selector .set-btn[data-set="math"]'
    ) as HTMLButtonElement;
    expect(basic.classList.contains('selected')).toBe(true);
    math.click();
    expect(math.classList.contains('selected')).toBe(true);
    expect(basic.classList.contains('selected')).toBe(false);
  });
});
