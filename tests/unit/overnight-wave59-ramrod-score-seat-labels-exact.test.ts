/**
 * Wave 59 leftover after #279 — Ramrod score .label seat prefixes exact.
 * Distinct from wave52/48 soft Blue/Red and wave58 Goal: 24cm. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderScores } from '../../src/games/ramrod/board-ui';

describe('Wave 59 ramrod — score seat labels exact', () => {
  it('renders seat-prefixed Blue/Red score labels', () => {
    const el = renderScores(createInitialState());
    const labels = [...el.querySelectorAll('.label')].map((n) => n.textContent);
    expect(labels).toEqual(['🔵 Blue:', '🔴 Red:']);
  });
});
