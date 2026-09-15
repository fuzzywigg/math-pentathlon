/**
 * Wave 64 leftover after #305 — FIAR winning axes + adjacent block exact.
 * Wave63 locks Form 4 + Blocking strong; deepen axes + prevents leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial winning axes block exact', () => {
  it('winning locks horizontal/vertical/diagonal and adjacent prevents win', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'Rows can be horizontal, vertical, or diagonal'
    );
    expect(step?.message).toContain(
      'An opponent chip adjacent to your 4-in-a-row prevents the win!'
    );
  });
});
