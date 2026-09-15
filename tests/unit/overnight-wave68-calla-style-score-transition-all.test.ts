/**
 * Wave 68 leftover after tip/#333 — score transition all.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style score transition all', () => {
  it('score transitions all with transition-fast', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\s*\{[^}]*transition:\s*all var\(--transition-fast\)/s);
  });
});
