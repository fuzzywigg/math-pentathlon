/**
 * Wave 48 — Ramrod hasValidMoves true on opening leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — hasValid opening', () => {
  it('opening hand has at least one valid placement', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
  });
});
