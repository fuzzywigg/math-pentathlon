/**
 * Wave 66 leftover after tip/#316 — Calla 480px media shrink leftovers.
 * Soft board mount existed; lock 95vw/14px/20px leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style media 480 shrink', () => {
  it('480px media shrinks board/pit-count/store-count', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('max-width: 95vw');
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.calla-pit-count\s*\{[^}]*font-size:\s*14px/);
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.calla-store-count\s*\{[^}]*font-size:\s*20px/);
  });
});
