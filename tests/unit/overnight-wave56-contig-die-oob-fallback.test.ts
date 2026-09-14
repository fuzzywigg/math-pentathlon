/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig die OOB fallback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 56 contig — die OOB fallback', () => {
  it('falls back to numeric text for faces outside 1-6 leftover', () => {
    const el = renderDice([7, 8, 9], () => undefined, false);
    const faces = [...el.querySelectorAll('.contig-die')].map((d) => d.textContent);
    expect(faces).toEqual(['7', '8', '9']);
  });
});
