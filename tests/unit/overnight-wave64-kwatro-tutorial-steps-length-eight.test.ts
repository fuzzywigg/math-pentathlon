/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial steps length + ordered ids.
 * Titles locked in wave60; deepen length/order leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial steps length eight', () => {
  it('locks eight steps in welcome…complete order', () => {
    expect(kwatroSinkoTutorial.steps).toHaveLength(8);
    expect(kwatroSinkoTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'setup',
      'turn-sequence',
      'movement-rules',
      'winning',
      'strategy-tips',
      'complete',
    ]);
  });
});
