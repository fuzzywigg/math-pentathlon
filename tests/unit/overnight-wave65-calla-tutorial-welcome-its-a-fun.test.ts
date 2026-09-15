/**
 * Wave 65 leftover after tip/#315 — Calla welcome It's-a-fun clause.
 * Wave63 soft fun counting game; lock It's a prefix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial welcome its a fun', () => {
  it("locks It's a fun counting game clause", () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain("It's a fun counting game");
    expect(step?.position).toBe('center');
  });
});
