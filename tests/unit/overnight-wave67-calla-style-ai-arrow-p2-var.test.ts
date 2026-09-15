/**
 * Wave 67 leftover after tip/#323/#324 — AI arrow-p2 color-ai.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style ai arrow-p2 var', () => {
  it('AI opponent remaps arrow-p2 stroke to color-ai', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\[data-opponent='ai'\] \.calla-arrow-p2[\s\S]*?stroke:\s*var\(--color-ai\)/);
    expect(css).toContain('.game-vs-ai .calla-arrow-p2');
  });
});
