/**
 * Wave 67 leftover after tip/#324 — Kings objective trap strong exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial objective trap strong', () => {
  it('objective locks trap strong + traps-wins exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toContain("<strong>trap your opponent's King</strong>");
    expect(step?.message).toContain("The player who traps the other's King wins!");
    expect(step?.position).toBe('center');
  });
});
