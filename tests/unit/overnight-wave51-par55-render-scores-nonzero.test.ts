/**
 * Wave 51 leftover after #233 — Par55 nonzero scores. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';
import { renderScores } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — scores nonzero', () => {
  it('renders nonzero Blue/Red values and target', () => {
    const el = renderScores({
      ...createInitialState(),
      scores: { player1: 12, player2: 8 },
    });
    expect(el.querySelector('.par55-score.player1 .value')?.textContent).toBe('12');
    expect(el.querySelector('.par55-score.player2 .value')?.textContent).toBe('8');
    expect(el.querySelector('.par55-target')?.textContent).toMatch(
      new RegExp(String(CONFIG.TARGET_SCORE))
    );
  });
});
