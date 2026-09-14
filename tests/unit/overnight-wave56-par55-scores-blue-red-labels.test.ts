/**
 * Wave 56 leftover after #256 — Par 55 score Blue/Red labels + target. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderScores } from '../../src/games/par-55/board-ui';

describe('Wave 56 par55 — score labels', () => {
  it('Blue:/Red: labels and Target: 55', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.par55-score.player1 .label')?.textContent).toMatch(/Blue:/);
    expect(el.querySelector('.par55-score.player2 .label')?.textContent).toMatch(/Red:/);
    expect(el.querySelector('.par55-target')?.textContent).toBe('Target: 55');
  });
});
