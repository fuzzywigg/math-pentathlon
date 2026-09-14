/**
 * Wave 49 — Frac-fact renderProblem null gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — problem null', () => {
  it('shows no-problem placeholder', () => {
    const el = renderProblem(createInitialState());
    expect(el.querySelector('.frac-no-problem')?.textContent).toMatch(/No problem/);
  });
});
