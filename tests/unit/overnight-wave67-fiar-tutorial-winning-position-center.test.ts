/**
 * Wave 67 leftover after tip/#316 — FIAR winning position center.
 * Wave65 diagonal/block body; lock winning position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial winning position', () => {
  it('winning step positions center', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.position).toBe('center');
  });
});
