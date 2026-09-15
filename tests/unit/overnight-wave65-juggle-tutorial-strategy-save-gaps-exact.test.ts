/**
 * Wave 65 leftover after tip/#315 — Juggle strategy Save-gaps exact tip.
 * Wave59 soft Save small shapes; lock full tip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial strategy save gaps exact', () => {
  it('locks Save small shapes for filling gaps tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Save small shapes for filling gaps');
  });
});
