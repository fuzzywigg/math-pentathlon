/**
 * Wave 67 leftover after tip/#324 — Kings winning no-valid-moves strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial winning no moves strong', () => {
  it('winning locks no valid moves strong + all 8 squares', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('<strong>no valid moves</strong>');
    expect(step?.message).toContain('all 8 squares around their King');
    expect(step?.position).toBe('center');
  });
});
