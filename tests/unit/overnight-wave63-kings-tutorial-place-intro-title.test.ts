/**
 * Wave 63 leftover after #301 — Kings place-quadraphage-intro Step 2 title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial place-intro title', () => {
  it('place-quadraphage-intro Step 2 title; center', () => {
    const intro = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'place-quadraphage-intro'
    );
    expect(intro?.title).toBe('Step 2: Place a Quadraphage');
    expect(intro?.position).toBe('center');
  });
});
