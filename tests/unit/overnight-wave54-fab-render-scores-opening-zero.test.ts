/**
 * Wave 54 leftover after #240 — Fab opening zero scores (wave53 nonzero). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderScores } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — scores opening zero', () => {
  it('both seats start at 0', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.fab-score-p1 .fab-score-value')?.textContent).toBe('0');
    expect(el.querySelector('.fab-score-p2 .fab-score-value')?.textContent).toBe('0');
  });
});
