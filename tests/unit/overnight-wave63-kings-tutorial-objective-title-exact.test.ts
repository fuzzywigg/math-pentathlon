/**
 * Wave 63 leftover after #301 — Kings Game Objective title residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial objective title', () => {
  it('objective title Game Objective; center', () => {
    const objective = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.title).toBe('Game Objective');
    expect(objective?.position).toBe('center');
  });
});
