/**
 * Wave 56 leftover after #256 — Graph analysis Player 1 (Blue) / Player 2 (Red) cards.
 * Distinct from wave51 empty-regions leftover. Tests-only.
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

describe('Wave 56 demos — graph analysis Blue/Red', () => {
  it('mounts three analysis-cards with Blue/Red/Board Status headings', () => {
    const root = mount();
    renderGraphDemo(root);
    const cards = root.querySelectorAll('#game-analysis .analysis-card');
    expect(cards.length).toBe(3);
    const text = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(text).toContain('Player 1 (Blue)');
    expect(text).toContain('Player 2 (Red)');
    expect(text).toContain('Board Status');
  });
});
