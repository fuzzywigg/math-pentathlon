/**
 * Wave 68 leftover after tip/#336 — Hex AI opponent p2 fill exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style AI p2 fill', () => {
  it('ai hex-cell-p2 fill color-ai + purple drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain("[data-opponent='ai'] .hex-cell-p2");
    expect(css).toContain('fill: var(--color-ai)');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4))');
  });
});
