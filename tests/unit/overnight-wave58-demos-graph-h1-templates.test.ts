/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Graph demo h1/h2 titles.
 * Distinct from Path found! / path-status exact leftovers. Tests-only.
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

describe('Wave 58 demos — graph h1/templates', () => {
  it('exposes Graph/Network System Demo h1 and Templates/Pathfinding h2s', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe(
      'Graph/Network System Demo'
    );
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Graph Templates');
    expect(h2).toContain('Pathfinding');
  });
});
