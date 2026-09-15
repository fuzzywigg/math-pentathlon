/**
 * Wave 68 leftover after tip/#333 — turn Select exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial turn select exact li', () => {
  it('turn-sequence locks Select shape li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<li><strong>Select:</strong> Choose a specific shape from that category</li>');
  });
});
