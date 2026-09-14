/**
 * Wave 40 — hex rotateLeft/Right 6-cycle leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  rotateLeft,
  rotateRight,
  hexEquals,
} from '../../src/core/hex';

describe('Wave 40 hex — rotate left/right cycle', () => {
  const c = createAxial(3, -1);

  it('six rotateRight returns to start', () => {
    let h = c;
    for (let i = 0; i < 6; i++) h = rotateRight(h);
    expect(hexEquals(h, c)).toBe(true);
  });

  it('six rotateLeft returns to start; left undoes right', () => {
    let h = c;
    for (let i = 0; i < 6; i++) h = rotateLeft(h);
    expect(hexEquals(h, c)).toBe(true);
    expect(hexEquals(rotateLeft(rotateRight(c)), c)).toBe(true);
  });
});
