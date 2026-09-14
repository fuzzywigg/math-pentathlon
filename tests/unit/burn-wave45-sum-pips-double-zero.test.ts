/**
 * Wave 45 — Sum getDominoPips / isDouble on 0-0
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createDominoSet, getDominoPips, isDouble } from '../../src/games/sum-dominoes/types';

describe('Wave 45 Sum types — 0-0 pips double', () => {
  it('double-zero is a double with 0 pips', () => {
    const zero = createDominoSet().find((d) => d.face1 === 0 && d.face2 === 0)!;
    expect(isDouble(zero)).toBe(true);
    expect(getDominoPips(zero)).toBe(0);
  });
});
