/**
 * Wave 67 leftover after tip/#323/#324 — placement rotated exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial placement rotated exact li', () => {
  it('placement locks rotated/flipped exact list item', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain('<li>Shapes can be rotated and flipped</li>');
  });
});
