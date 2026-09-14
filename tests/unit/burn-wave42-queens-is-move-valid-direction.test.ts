/**
 * Wave 42 — Queens & Guards isMoveValid direction rules leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isMoveValid } from '../../src/games/queens-guards/types';

describe('Wave 42 queens — isMoveValid direction rules', () => {
  it('same-ring sideways moves are valid', () => {
    expect(isMoveValid({ ring: 3, position: 4 }, { ring: 3, position: 5 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 5, position: 7 }, { ring: 5, position: 6 })).toBe(
      true
    );
  });

  it('inward moves toward center are valid', () => {
    expect(isMoveValid({ ring: 2, position: 0 }, { ring: 1, position: 0 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 1, position: 3 }, { ring: 0, position: 0 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 5, position: 10 }, { ring: 4, position: 8 })).toBe(
      true
    );
  });

  it('outward moves away from center are invalid in normal play', () => {
    expect(isMoveValid({ ring: 1, position: 0 }, { ring: 2, position: 0 })).toBe(
      false
    );
    expect(isMoveValid({ ring: 0, position: 0 }, { ring: 1, position: 0 })).toBe(
      false
    );
    expect(isMoveValid({ ring: 3, position: 5 }, { ring: 4, position: 6 })).toBe(
      false
    );
  });
});
