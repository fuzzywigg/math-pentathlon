/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro winning position center.
 * Wave60 locks Winning title; deepen position. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial winning position', () => {
  it('winning step is center positioned', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'winning')?.position
    ).toBe('center');
  });
});
