/**
 * Wave 67 leftover after tip/#316 — Calla store-count weight + text-shadow.
 * Wave66 locked 28px/#ffd700; lock font-weight + dual text-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store-count weight shadow', () => {
  it('store-count uses font-weight 700 and dual text-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-count\s*\{[^}]*font-weight:\s*700/s);
    expect(css).toContain('0 0 10px rgba(255, 215, 0, 0.3)');
  });
});
