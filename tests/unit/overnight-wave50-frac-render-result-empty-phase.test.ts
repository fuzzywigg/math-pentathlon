/**
 * Overnight HEAVY leftover after #229 — Frac Fact result empty outside showingResult. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — result empty phase', () => {
  it('returns empty shell while playing', () => {
    const el = renderResult(createInitialState('easy'), () => undefined);
    expect(el.classList.contains('frac-result')).toBe(true);
    expect(el.querySelector('.frac-feedback')).toBeNull();
    expect(el.querySelector('.frac-continue-btn')).toBeNull();
  });
});
