/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone AI p2 stroke exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style AI p2 stroke', () => {
  it('ai hex-a-gone-cell-p2 stroke color-ai-dark + purple filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain("[data-opponent='ai'] .hex-a-gone-cell-p2");
    expect(css).toContain('stroke: var(--color-ai-dark)');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))');
  });
});
