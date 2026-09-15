/**
 * Wave 66 leftover after tip/#316 — Calla board max-width 550 + drop-shadow.
 * Soft board class existed; lock size/shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style board maxw 550', () => {
  it('board max-width 550px with drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*max-width:\s*550px/s);
    expect(css).toContain('drop-shadow(0 6px 16px rgba(0, 0, 0, 0.2))');
  });
});
