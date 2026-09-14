/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab score seat icons exact.
 * Wave55 matches Blue/Red; deepen exact seat-icon labels leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderScores } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 61 fab — scores seat icons exact', () => {
  it('score labels are exact Blue/Red with seat icons', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.fab-score-p1 .fab-score-label')?.textContent).toBe(
      '🔵 Blue'
    );
    expect(el.querySelector('.fab-score-p2 .fab-score-label')?.textContent).toBe(
      '🔴 Red'
    );
  });
});
