/**
 * Wave 68 leftover after tip/#333 — welcome learn strong exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial welcome learn strong exact', () => {
  it('welcome locks learn strong Juggle sentence', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain("Let's learn how to play <strong>Juggle</strong>!");
  });
});
