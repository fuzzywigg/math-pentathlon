/**
 * Wave 67 leftover after tip/#323/#324 — placement fit exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial placement fit exact li', () => {
  it('placement locks fit-entirely exact list item', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain('<li>Shapes must fit entirely within your 9x9 grid</li>');
  });
});
