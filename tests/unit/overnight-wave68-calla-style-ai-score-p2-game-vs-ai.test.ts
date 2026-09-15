/**
 * Wave 68 leftover after tip/#333 — AI score-p2 game-vs-ai selector.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style ai score p2 game vs ai', () => {
  it('game-vs-ai remaps score-p2.active violet chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain(".game-vs-ai .calla-score-p2.active");
    expect(css).toContain("[data-opponent='ai'] .calla-score-p2.active");
  });
});
