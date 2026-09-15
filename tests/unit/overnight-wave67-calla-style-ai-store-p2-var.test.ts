/**
 * Wave 67 leftover after tip/#323/#324 — AI store-p2 color-ai.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style ai store-p2 var', () => {
  it('AI opponent remaps store-p2 stroke to color-ai', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\[data-opponent='ai'\] \.calla-store-p2\.calla-store-active \.calla-store-rect[\s\S]*?stroke:\s*var\(--color-ai\)/);
    expect(css).toContain('drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))');
  });
});
