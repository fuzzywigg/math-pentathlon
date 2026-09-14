/**
 * Wave 58 leftover after #267 — Graph Clear Board button label.
 * Distinct from clear-path leftover. Tests-only.
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

describe('Wave 58 demos — graph Clear Board', () => {
  it('exposes Clear Board on interactive game board', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    expect(root.querySelector('#clear-game-btn')?.textContent?.trim()).toBe(
      'Clear Board'
    );
  });
});
