/**
 * Wave 54 leftover after #240 — Pinball game-over draw banner exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — draw banner exact', () => {
  it('uses It\'s a Draw! copy', () => {
    const el = renderGameOver({ ...createInitialState(), winner: null });
    expect(el.querySelector('.pinball-winner-banner')?.textContent).toBe(
      "It's a Draw!"
    );
  });
});
