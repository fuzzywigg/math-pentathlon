/**
 * Wave 67 leftover after tip/#316 — Calla status flex/gap/shadow leftovers.
 * Wave66 locked gradient/radius/pad; lock flex column + gap + shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style status flex gap shadow', () => {
  it('status uses column flex, gap 0.75rem, and dual box-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-status\s*\{[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/\.calla-status\s*\{[^}]*gap:\s*0\.75rem/s);
    expect(css).toContain('0 4px 12px rgba(0, 0, 0, 0.08)');
    expect(css).toContain('0 1px 3px rgba(0, 0, 0, 0.05)');
  });
});
