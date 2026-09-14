/**
 * Wave 55 leftover after #249/#250 — Fab score labels Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderScores } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 55 fab — score labels', () => {
  it('p1 label contains Blue and p2 contains Red', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.fab-score-p1 .fab-score-label')?.textContent).toMatch(
      /Blue/
    );
    expect(el.querySelector('.fab-score-p2 .fab-score-label')?.textContent).toMatch(
      /Red/
    );
  });
});
