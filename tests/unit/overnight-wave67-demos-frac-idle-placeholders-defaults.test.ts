/**
 * Wave 67 leftover after tip/#324 (unit-only) — frac idle placeholders.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — frac idle placeholders + defaults', () => {
  it('locks arithmetic/compare/equiv idle input defaults', () => {
    const root = mount();
    renderFractionDemo(root);
    expect((root.querySelector('#fraction-a') as HTMLInputElement).value).toBe('3/4');
    expect((root.querySelector('#fraction-a') as HTMLInputElement).placeholder).toBe('3/4');
    expect((root.querySelector('#fraction-b') as HTMLInputElement).value).toBe('1/2');
    expect((root.querySelector('#fraction-b') as HTMLInputElement).placeholder).toBe('1/2');
    expect((root.querySelector('#compare-a') as HTMLInputElement).value).toBe('2/3');
    expect((root.querySelector('#compare-b') as HTMLInputElement).value).toBe('3/4');
    expect((root.querySelector('#equiv-fraction') as HTMLInputElement).value).toBe('1/2');
    expect((root.querySelector('#equiv-fraction') as HTMLInputElement).placeholder).toBe('1/2');
  });
});
