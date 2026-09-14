/**
 * Wave 58 leftover after #267 — Graph demo exact h1.
 * Distinct from path/template leftovers. Tests-only.
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

describe('Wave 58 demos — graph h1 exact', () => {
  it('mounts Graph/Network System Demo h1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'Graph/Network System Demo'
    );
  });
});
