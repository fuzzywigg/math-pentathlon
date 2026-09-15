/**
 * Wave 68 leftover after tip/#333 — turn Place exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial turn place exact li', () => {
  it('turn-sequence locks Place shape li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<li><strong>Place:</strong> Position and place the shape on your board</li>');
  });
});
