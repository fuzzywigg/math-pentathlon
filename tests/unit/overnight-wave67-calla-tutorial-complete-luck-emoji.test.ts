/**
 * Wave 67 leftover after tip/#316 — Calla complete Good luck emoji exact.
 * Wave63 locked Finish CTA; lock Good luck ice-cube leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial complete luck emoji', () => {
  it('complete locks Good luck ice-cube sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Good luck! 🧊');
    expect(step?.title).toBe('Ready to Play!');
  });
});
