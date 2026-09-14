/**
 * Wave 56 leftover after #256 — Stars tutorial welcome + attribute-cards. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';

describe('Wave 56 stars — tutorial welcome/attrs', () => {
  it('welcome title and attribute-cards highlight', () => {
    expect(starsBarsTutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Stars & Bars!'
    );
    const attrs = starsBarsTutorial.steps.find((s) => s.id === 'attribute-cards');
    expect(attrs?.title).toBe('Attribute Cards');
    expect(attrs?.highlightSelector).toBe('.stars-hand');
    expect(attrs?.message).toMatch(/Size|color|shape|thickness/i);
  });
});
