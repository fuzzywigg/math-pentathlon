/**
 * Wave 49 — Par55 renderScores target banner leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';
import { renderScores } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — scores target', () => {
  it('shows Blue/Red scores and Target', () => {
    const s = { ...createInitialState(), scores: { player1: 12, player2: 7 } };
    const el = renderScores(s);
    expect(el.className).toBe('par55-scores');
    expect(el.querySelector('.par55-target')?.textContent).toBe(
      `Target: ${CONFIG.TARGET_SCORE}`
    );
    expect(el.querySelector('.player1 .value')?.textContent).toBe('12');
    expect(el.querySelector('.player2 .value')?.textContent).toBe('7');
    expect(el.textContent).toMatch(/Blue:/);
    expect(el.textContent).toMatch(/Red:/);
  });
});
