/**
 * Wave 43 — Handshake ramrod×stars target scores. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { CONFIG as RAMROD } from '../../src/games/ramrod/types';
import { CONFIG as STARS } from '../../src/games/stars-bars/types';

describe('Wave 43 handshake — ramrod×stars targets', () => {
  it('distinct positive target scores', () => {
    expect(RAMROD.TARGET_SCORE).toBe(24);
    expect(STARS.TARGET_SCORE).toBe(30);
    expect(RAMROD.TARGET_SCORE).not.toBe(STARS.TARGET_SCORE);
  });
});
