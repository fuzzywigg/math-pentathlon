/**
 * Wave 58 Contig/SD residual — Contig die face OOB string fallback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 58 contig — die OOB fallback', () => {
  it('non 1-6 faces render as decimal strings', () => {
    const el = renderDice([7, 0, 3] as [number, number, number], () => undefined, false);
    const faces = [...el.querySelectorAll('.contig-die')].map((d) => d.textContent);
    expect(faces).toEqual(['7', '0', '⚂']);
  });
});
