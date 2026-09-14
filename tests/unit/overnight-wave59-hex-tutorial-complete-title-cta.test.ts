/**
 * Wave 59 leftover after #276 — Hex complete title + connect sides CTA. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 59 hex — tutorial complete CTA', () => {
  it('complete Ready to Play!; connect your sides; center', () => {
    const complete = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.title).toBe('Ready to Play!');
    expect(complete?.message).toMatch(/connect your sides/);
    expect(complete?.position).toBe('center');
  });
});
