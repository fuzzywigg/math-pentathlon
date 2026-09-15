/**
 * Wave 68 leftover after tip/#337 — Contig pass pad + min-width.
 * Soft neutral-600 existed; lock pad/min-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style pass pad minwidth', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?padding:\s*10px 20px/);
    expect(css).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?min-width:\s*120px/);
  });
});
