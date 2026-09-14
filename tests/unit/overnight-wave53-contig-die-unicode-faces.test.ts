/**
 * Overnight HEAVY leftovers after #236 — Contig die unicode faces leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — die unicode', () => {
  it('maps 1–6 to ⚀–⚅ on contig-die faces', () => {
    const el = renderDice([1, 3, 6], () => undefined, false);
    const faces = [...el.querySelectorAll('.contig-die')].map((n) => n.textContent);
    expect(faces).toEqual(['⚀', '⚂', '⚅']);
  });
});
