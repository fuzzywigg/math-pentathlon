/**
 * Wave 48 — Ramrod placeRod identity when still selectingRod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeRod } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — place wrong phase', () => {
  it('identity without selectedRod in selectingRod', () => {
    const s = createInitialState();
    expect(placeRod(s, 'box-0-0', 0)).toBe(s);
  });
});
