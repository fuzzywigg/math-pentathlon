/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone select different strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 67 hexagone — tutorial select different strong', () => {
  it('select-shapes locks <strong>different</strong> shapes', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes');
    expect(step?.message).toContain('<strong>different</strong> shapes');
    expect(step?.position).toBe('top');
  });
});
