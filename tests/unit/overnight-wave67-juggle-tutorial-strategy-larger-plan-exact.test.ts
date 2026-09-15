/**
 * Wave 67 leftover after tip/#316 — Juggle strategy larger/plan exact lis.
 * Soft save-small existed; lock larger + plan-ahead exact lis leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial strategy larger plan exact', () => {
  it('strategy-tips locks larger-shapes and plan-ahead exact lis', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Larger shapes fill the board faster</li>'
    );
    expect(step?.message).toContain(
      '<li>Plan ahead to avoid getting stuck</li>'
    );
  });
});
