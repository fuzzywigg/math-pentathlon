/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod ROD_COLORS exact hex map.
 * Distinct from wave56 ROD_NAMES. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ROD_COLORS } from '../../src/games/ramrod/types';

describe('Wave 58 ramrod — rod colors exact', () => {
  it('locks Cuisenaire length→hex map 1–10', () => {
    expect(ROD_COLORS).toEqual({
      1: '#ffffff',
      2: '#e53935',
      3: '#7cb342',
      4: '#8e24aa',
      5: '#fdd835',
      6: '#388e3c',
      7: '#212121',
      8: '#6d4c41',
      9: '#1976d2',
      10: '#ff9800',
    });
  });
});
