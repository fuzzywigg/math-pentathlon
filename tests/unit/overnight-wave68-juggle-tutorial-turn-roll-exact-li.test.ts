/**
 * Wave 68 leftover after tip/#333 — turn Roll exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial turn roll exact li', () => {
  it('turn-sequence locks Roll two dice li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<li><strong>Roll:</strong> Roll two dice</li>');
  });
});
