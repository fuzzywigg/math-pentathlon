/**
 * Wave 65 leftover after tip/#315 — Juggle strategy Save small for filling gaps.
 * Wave59 soft Save small shapes; filling gaps untouched. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial strategy filling gaps', () => {
  it('locks Save small shapes for filling gaps tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
    expect(step?.message).toContain(
      'Save small shapes for filling gaps'
    );
  });
});
