/**
 * Wave 45 — Contig createBoard duplicate number throw
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { BOARD_NUMBERS, createBoard } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — createBoard duplicate throw', () => {
  it('throws when a custom grid repeats a value', () => {
    const dup = BOARD_NUMBERS.map((row) => [...row]);
    dup[0][1] = dup[0][0];
    expect(() => createBoard(dup)).toThrow(/Duplicate board number/);
  });
});
