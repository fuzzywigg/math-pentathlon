/**
 * Wave 59 leftover after #276 — Kings select-king title + glow gold copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 59 kings — tutorial select-king title/glow', () => {
  it('select-king title Step 1; message glow gold', () => {
    const select = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(select?.title).toBe('Step 1: Select Your King');
    expect(select?.message).toMatch(/glow gold/);
  });
});
