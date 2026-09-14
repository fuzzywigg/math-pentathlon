/**
 * Overnight TOKENMAXX — hexInArray on empty / duplicates.
 * Beyond overnight equals-dupes smoke. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { hexInArray, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — inArray empty', () => {
  it('empty array false; duplicate entries still true once', () => {
    const a = createAxial(1, 1);
    expect(hexInArray(a, [])).toBe(false);
    const dup = [createAxial(0, 0), a, a, createAxial(2, 2)];
    expect(hexInArray(a, dup)).toBe(true);
    expect(hexEquals(dup[1], dup[2])).toBe(true);
    expect(hexInArray(createAxial(9, 9), dup)).toBe(false);
  });
});
