/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro strategy position center.
 * Wave60 locks Strategy Tips title; deepen position. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial strategy position', () => {
  it('strategy-tips is center positioned', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips')?.position
    ).toBe('center');
  });
});
