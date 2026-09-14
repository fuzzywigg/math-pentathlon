/**
 * Wave 54 leftover after #240 — Pinball round label copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — round label', () => {
  it('uses Round label', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.pinball-round-label')?.textContent).toBe('Round');
  });
});
