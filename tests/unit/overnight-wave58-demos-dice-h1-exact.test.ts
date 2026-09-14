/**
 * Wave 58 leftover after #267 — Dice demo exact h1 title.
 * Distinct from wave56 quick-roll placeholder. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — dice h1 exact', () => {
  it('mounts exact Dice System Demo h1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderDiceDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe('🎲 Dice System Demo');
  });
});
