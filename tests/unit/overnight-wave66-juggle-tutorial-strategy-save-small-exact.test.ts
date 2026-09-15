/**
 * Wave 66 leftover after tip/#316 — Juggle strategy save-small exact li.
 * Soft Save small shapes existed; lock full tip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 66 juggle — tutorial strategy save small exact', () => {
  it('strategy-tips include save-small gaps exact li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Save small shapes for filling gaps</li>'
    );
  });
});
