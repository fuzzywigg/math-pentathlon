/**
 * Wave 58 leftover after #267 — Graph section h2 catalog.
 * Distinct from h1 leftover. Tests-only.
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

describe('Wave 58 demos — graph section h2s', () => {
  it('exposes Templates/Pathfinding/Game Board/Connectivity h2s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Graph Templates');
    expect(h2s).toContain('Pathfinding');
    expect(h2s).toContain('Interactive Game Board');
    expect(h2s).toContain('Connectivity Analysis');
  });
});
