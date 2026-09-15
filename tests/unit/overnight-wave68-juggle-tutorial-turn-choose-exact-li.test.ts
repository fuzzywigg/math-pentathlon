/**
 * Wave 68 leftover after tip/#333 — turn Choose exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial turn choose exact li', () => {
  it('turn-sequence locks Choose die li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain("<li><strong>Choose:</strong> Pick one die - its value determines your shape category</li>");
  });
});
