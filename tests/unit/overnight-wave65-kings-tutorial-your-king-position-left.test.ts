/**
 * Wave 65 leftover after tip/#313 — Kings your-king position left. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial your-king position left', () => {
  it('your-king position is left', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king');
    expect(step?.position).toBe('left');
  });
});
