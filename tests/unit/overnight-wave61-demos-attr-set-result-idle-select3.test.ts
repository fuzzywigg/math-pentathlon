/**
 * Wave 61 leftover after #301 (unit-only) — Attribute SET Select 3 more idle ladder.
 * Distinct from wave56 Select 2 / Select 1 exact leftover. Tests-only.
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

describe('Wave 61 demos — attr set-result Select 3', () => {
  it('deselecting last card paints Select 3 more card(s)', () => {
    const root = mount();
    renderAttributeDemo(root);
    const wrappers = [...root.querySelectorAll('#set-grid .set-card')].map(
      (el) => el.parentElement as HTMLElement
    );
    expect(wrappers.length).toBeGreaterThanOrEqual(1);
    wrappers[0].click();
    wrappers[0].click();
    expect(root.querySelector('#set-result')?.textContent).toBe(
      'Select 3 more card(s)'
    );
    expect(root.querySelector('#set-result')?.className).toBe('set-result');
  });
});
