/**
 * Wave 57 leftover after #262 — Ramrod Goal: 24cm exact.
 * Distinct from wave52 soft /Goal:/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderScores } from '../../src/games/ramrod/board-ui';

describe('Wave 57 ramrod — goal 24cm exact', () => {
  it('renders exact Goal: 24cm target', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.ramrod-target')?.textContent).toBe('Goal: 24cm');
  });
});
