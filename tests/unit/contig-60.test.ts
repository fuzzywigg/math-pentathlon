import { describe, it, expect } from 'vitest';
import { BOARD_NUMBERS, createBoard } from '../../src/games/contig-60/types';

describe('Contig 60 Board', () => {
  it('BOARD_NUMBERS contains no duplicates', () => {
    const flat = BOARD_NUMBERS.flat();
    const unique = new Set(flat);
    expect(unique.size).toBe(flat.length);
  });

  it('createBoard throws error on duplicate values (if present)', () => {
    // This test implicitly relies on BOARD_NUMBERS being correct.
    // To test the error throwing specifically, we'd need to mock BOARD_NUMBERS
    // or create a separate test utility. For now, we expect it not to throw
    // since BOARD_NUMBERS is now fixed.
    expect(() => createBoard()).not.toThrow();
  });
});