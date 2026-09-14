/**
 * Overnight HEAVY leftover after #241 — Turns Left label copy. Tests-only.
 * Distinct from wave48 turns-value number.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderScores } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — turns label', () => {
  it('turns label is Turns Left', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.remainder-turns-label')?.textContent).toBe('Turns Left');
  });
});
