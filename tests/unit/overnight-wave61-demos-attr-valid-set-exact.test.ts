/**
 * Wave 61 leftover after #301 (unit-only) — Attribute Valid SET exact text + className.
 * Distinct from demos46 soft Valid SET! regex leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function setCardWrappers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('#set-grid .set-card')].map(
    (el) => el.parentElement as HTMLElement
  );
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 61 demos — attr valid SET exact', () => {
  it('cards 0,1,2 paint exact ✓ Valid SET! and className set-result valid', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards[0].click();
    cards[1].click();
    cards[2].click();
    const result = root.querySelector('#set-result');
    expect(result?.textContent).toBe('✓ Valid SET!');
    expect(result?.className).toBe('set-result valid');
  });
});
