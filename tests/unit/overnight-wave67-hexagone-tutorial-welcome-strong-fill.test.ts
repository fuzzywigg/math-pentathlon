/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone welcome strong + fill board. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 67 hexagone — tutorial welcome strong fill', () => {
  it('welcome locks strong name + fill up the board', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('<strong>Hex-a-Gone!</strong>');
    expect(step?.message).toContain('fill up the board');
    expect(step?.title).toBe('Welcome to Hex-a-Gone!');
  });
});
