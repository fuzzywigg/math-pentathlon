/**
 * Wave 56 leftover after #256 — Calla opening score strong zeros.
 * Distinct from wave50 non-zero strong tags. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — status opening zeros', () => {
  it('shows Blue/Red strong 0 scores on opening HvH', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el);
    expect(el.querySelector('.calla-score-p1')?.innerHTML).toMatch(
      /Blue: <strong>0<\/strong>/
    );
    expect(el.querySelector('.calla-score-p2')?.innerHTML).toMatch(
      /Red: <strong>0<\/strong>/
    );
    expect(el.querySelector('.status-turn')?.textContent).toMatch(
      /Select a shield/
    );
  });
});
