/**
 * Wave 49 leftover after #221/#226/#227 — Stars renderScores opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';
import { renderScores } from '../../src/games/stars-bars/board-ui';

describe('Wave 49 stars — scores', () => {
  it('shows zero scores against target', () => {
    const el = renderScores(createInitialState());
    expect(el.classList.contains('stars-scores')).toBe(true);
    expect(el.textContent).toMatch(new RegExp(`0 / ${CONFIG.TARGET_SCORE}`));
  });
});
