/**
 * Wave 49 leftover after #221/#226/#227 — Par55 renderScores opening zeros. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';
import { renderScores } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — scores', () => {
  it('shows zero scores and target 55', () => {
    const el = renderScores(createInitialState());
    expect(el.classList.contains('par55-scores')).toBe(true);
    expect(el.querySelector('.par55-target')?.textContent).toBe(`Target: ${CONFIG.TARGET_SCORE}`);
    expect(el.querySelector('.par55-score.player1 .value')?.textContent).toBe('0');
    expect(el.querySelector('.par55-score.player2 .value')?.textContent).toBe('0');
  });
});
