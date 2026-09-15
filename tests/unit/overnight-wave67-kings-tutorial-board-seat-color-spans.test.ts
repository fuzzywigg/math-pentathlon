/**
 * Wave 67 leftover after tip/#324 — Kings board Blue/Red seat color spans. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial board seat color spans', () => {
  it('board-intro pins Blue/Red span colors exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('style="color: #2196F3">Blue (Player 1)</span>');
    expect(step?.message).toContain('style="color: #e53935">Red (Player 2)</span>');
    expect(step?.position).toBe('right');
  });
});
