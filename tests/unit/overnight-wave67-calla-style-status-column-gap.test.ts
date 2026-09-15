/**
 * Wave 67 leftover after tip/#323/#324 — status column gap.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style status column gap', () => {
  it('status stacks column with gap 0.75rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-status\s*\{[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/\.calla-status\s*\{[^}]*gap:\s*0\.75rem/s);
    expect(css).toMatch(/\.calla-status\s*\{[^}]*display:\s*flex/s);
  });
});
