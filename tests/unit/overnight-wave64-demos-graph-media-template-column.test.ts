/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph media template column.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

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

describe('Wave 64 demos — graph media template column', () => {
  it('locks @media 600px template-selector flex-direction column', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('flex-direction: column');
    expect(css).toMatch(/\.template-btn\s*\{[^}]*width:\s*100%/);
  });
});
