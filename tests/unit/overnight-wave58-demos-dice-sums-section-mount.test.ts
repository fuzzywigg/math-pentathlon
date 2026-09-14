/**
 * Wave 58 leftover after #267 — Dice Possible Sums section mount chrome.
 * Distinct from section h2 catalog leftover. Tests-only.
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

describe('Wave 58 demos — dice sums section mount', () => {
  it('mounts #selector-sums under Possible Sums Display', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderDiceDemo(root);
    expect(root.querySelector('#selector-sums')).toBeTruthy();
    const h2 = [...root.querySelectorAll('h2')].find(
      (h) => h.textContent?.trim() === 'Possible Sums Display'
    );
    expect(h2).toBeTruthy();
  });
});
