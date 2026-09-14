/**
 * Wave 65 leftover after tip/#305 — FIAR movement destination-click exact.
 * Wave63 pathways/straight-line; deepen click destination li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial movement destination exact', () => {
  it('movement-rules lists click chip then destination', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain(
      '<li>Click your chip to select, then click destination</li>'
    );
    expect(step?.position).toBe('bottom');
  });
});
