/**
 * Wave 42 — Queens & Guards cellKey / parseKey roundtrip leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { cellKey, parseKey, CONFIG } from '../../src/games/queens-guards/types';

describe('Wave 42 queens — cellKey / parseKey roundtrip', () => {
  it('center roundtrips', () => {
    const key = cellKey(0, 0);
    expect(key).toBe('0-0');
    expect(parseKey(key)).toEqual({ ring: 0, position: 0 });
  });

  it('ring 1 and outer ring positions roundtrip', () => {
    const samples = [
      { ring: 1, position: 0 },
      { ring: 1, position: 5 },
      { ring: CONFIG.NUM_RINGS - 1, position: 7 },
      { ring: CONFIG.NUM_RINGS - 1, position: 22 },
      { ring: 3, position: 11 },
    ];
    for (const coord of samples) {
      const key = cellKey(coord.ring, coord.position);
      expect(parseKey(key)).toEqual(coord);
    }
  });

  it('parseKey splits on hyphen into numeric ring and position', () => {
    expect(parseKey('4-18')).toEqual({ ring: 4, position: 18 });
    expect(parseKey('2-7')).toEqual({ ring: 2, position: 7 });
  });
});
