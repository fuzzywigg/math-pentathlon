/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr active challenge hidden.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Wave 64 demos — expr active-challenge hidden', () => {
  it('idle #active-challenge mounts with display none', () => {
    const root = mount();
    renderExpressionDemo(root);
    const el = root.querySelector('#active-challenge') as HTMLElement;
    expect(el.style.display).toBe('none');
  });
});
