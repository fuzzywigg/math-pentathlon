/**
 * Wave 68 leftover after tip/#333 — status soft 1px/3px shadow.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style status shadow 1px 3px', () => {
  it('status box-shadow includes soft 1px/3px layer', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 1px 3px rgba(0, 0, 0, 0.05)');
  });
});
