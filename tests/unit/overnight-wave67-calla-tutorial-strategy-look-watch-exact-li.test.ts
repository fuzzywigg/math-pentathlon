/**
 * Wave 67 leftover after tip/#323/#324 — strategy look/watch exact li.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial strategy look watch exact li', () => {
  it('strategy locks capture + watch exact list items', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('<li>Look for capture opportunities</li>');
    expect(step?.message).toContain("<li>Watch your opponent's side too!</li>");
  });
});
