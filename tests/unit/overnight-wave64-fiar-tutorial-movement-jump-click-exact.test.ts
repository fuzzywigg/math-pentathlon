/**
 * Wave 64 leftover after #305 — FIAR movement jump + click exacts.
 * Wave63 locks pathways + straight-line; deepen Cannot jump + Click chip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial movement jump click exact', () => {
  it('movement-rules locks Cannot jump and Click chip destination', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain('Cannot jump over other chips');
    expect(step?.message).toContain(
      'Click your chip to select, then click destination'
    );
  });
});
