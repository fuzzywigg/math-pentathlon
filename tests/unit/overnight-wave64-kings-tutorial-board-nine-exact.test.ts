/**
 * Wave 64 leftover after tip/#303 — Kings board-intro 9×9 board exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial board nine exact', () => {
  it('locks 9×9 board sentence + The Game Board title', () => {
    const intro = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.title).toBe('The Game Board');
    expect(intro?.message).toMatch(/9&times;9 board/);
    expect(intro?.highlightSelector).toBe('.board');
  });
});
