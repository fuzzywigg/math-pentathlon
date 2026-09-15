/**
 * Wave 67 leftover after tip/#324 — Kings your-king P1 color span. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial your-king color span', () => {
  it('your-king pins Player 1 color span exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king');
    expect(step?.message).toContain('style="color: #2196F3">Player 1\'s King</span>');
    expect(step?.title).toBe('Your King');
    expect(step?.position).toBe('left');
  });
});
