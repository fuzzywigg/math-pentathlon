/**
 * Wave 63 leftover after #301 — Kings welcome title + strategic intro. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial welcome title', () => {
  it('welcome title exact; strategic two-player + basics together', () => {
    const welcome = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Kings & Quadraphages!');
    expect(welcome?.message).toMatch(/a strategic two-player game/);
    expect(welcome?.message).toMatch(/Let's learn the basics together/);
    expect(welcome?.position).toBe('center');
  });
});
