/**
 * Wave 67 leftover after tip/#323/#324 — strategy larger exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial strategy larger exact li', () => {
  it('strategy locks Larger shapes exact list item', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('<li>Larger shapes fill the board faster</li>');
  });
});
