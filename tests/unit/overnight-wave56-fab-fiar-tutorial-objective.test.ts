/**
 * Wave 56 leftover after #255/#256 — fab + fiar tutorial objective steps. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 56 fab × fiar — tutorial objective', () => {
  it('covers claim-most and four-in-a-row objective copy', () => {
    const fabObj = fabADiffyTutorial.steps.find((s) => s.id === 'objective');
    expect(fabObj?.title).toBe('Objective');
    expect(fabObj?.message).toMatch(/Claim the most answer bars/);
    expect(fabObj?.message).toMatch(/fraction bars with operations/);
    expect(fabObj?.position).toBe('center');

    const fiarObj = fiarTutorial.steps.find((s) => s.id === 'objective');
    expect(fiarObj?.title).toBe('Objective');
    expect(fiarObj?.message).toMatch(/four of your chips in a row/);
    expect(fiarObj?.message).toMatch(/connected pathways/);
    expect(fiarObj?.position).toBe('center');
  });
});
