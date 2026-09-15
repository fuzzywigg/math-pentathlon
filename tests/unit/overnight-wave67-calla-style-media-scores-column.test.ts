/**
 * Wave 67 leftover after tip/#323/#324 — 480px scores column.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style media scores column', () => {
  it('480px media stacks scores column gap 0.5rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.calla-scores\s*\{[^}]*flex-direction:\s*column/);
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.calla-scores\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
