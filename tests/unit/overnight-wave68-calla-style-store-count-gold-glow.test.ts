/**
 * Wave 68 leftover after tip/#333 — store-count gold glow shadow.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store count gold glow', () => {
  it('store-count dual text-shadow includes gold glow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 0 10px rgba(255, 215, 0, 0.3)');
    expect(css).toMatch(/\.calla-store-count\s*\{[^}]*font-weight:\s*700/s);
  });
});
