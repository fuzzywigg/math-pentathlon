/**
 * Wave 68 leftover after tip/#337 — Sum media main-layout align center.
 * Soft column flex existed; lock align-items leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style media main align center', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toMatch(
      /@media \(max-width: 768px\)[\s\S]*?\.sd-main-layout\s*\{[\s\S]*?align-items:\s*center/
    );
  });
});
