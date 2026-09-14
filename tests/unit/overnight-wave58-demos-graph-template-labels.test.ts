/**
 * Wave 58 leftover after #267 — Graph template button label catalog.
 * Distinct from wave56/57 template click leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — graph template labels', () => {
  it('exacts Circular/Track/Complete template button labels', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    expect(
      root.querySelector('.template-btn[data-template="circular"]')?.textContent?.trim()
    ).toBe('Circular (8)');
    expect(
      root.querySelector('.template-btn[data-template="track"]')?.textContent?.trim()
    ).toBe('Track (10)');
    expect(
      root.querySelector('.template-btn[data-template="complete"]')?.textContent?.trim()
    ).toBe('Complete (5)');
  });
});
