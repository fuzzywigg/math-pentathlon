/**
 * Wave 58 leftover after #267 — Back to Games link copy on dice + align.
 * Distinct from wave56 back-btn aria matrix. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — back-link copy', () => {
  it('dice and align expose ← Back to Games', () => {
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    expect(dice.querySelector('.back-link')?.textContent?.trim()).toBe('← Back to Games');

    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    expect(align.querySelector('.back-link')?.textContent?.trim()).toBe('← Back to Games');
  });
});
