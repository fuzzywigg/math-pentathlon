/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — fraction compare 4-dp vs line.
 * Distinct from less/greater/equals text paths. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

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

describe('Wave 51 demos — frac compare decimal parens', () => {
  it('compare result appends (a.dddd vs b.dddd) line', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = '1/4';
    (root.querySelector('#compare-b') as HTMLInputElement).value = '3/4';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#comparison-result')?.textContent ?? '').toMatch(
      /\(\d+\.\d{4} vs \d+\.\d{4}\)/
    );
  });
});
