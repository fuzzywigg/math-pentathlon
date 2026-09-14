/**
 * Wave 56 leftover after #255/#256 — FIAR tutorial objective step. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 56 fiar — tutorial objective', () => {
  it('objective restates four-in-a-row pathways; center; no highlight', () => {
    expect(fiarTutorial.id).toBe('fiar-basics');
    const step = fiarTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toMatch(/four of your chips in a row/);
    expect(step?.message).toMatch(/connected pathways/);
    expect(step?.position).toBe('center');
    expect(step?.highlightSelector).toBeUndefined();
  });
});
