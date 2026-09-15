/**
 * Wave 67 leftover after tip/#324 — Kings opponent-king P2 color span. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial opponent-king color span', () => {
  it('opponent-king pins Player 2 color span exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(step?.message).toContain('style="color: #e53935">Player 2\'s King</span>');
    expect(step?.title).toBe("Opponent's King");
    expect(step?.position).toBe('top');
  });
});
