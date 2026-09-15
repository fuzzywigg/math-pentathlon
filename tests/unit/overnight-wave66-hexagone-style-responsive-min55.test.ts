/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone responsive min-width 55 exact.
 * Soft hover lift; lock 480px media min-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style responsive min55', () => {
  it('480px media block-btn min-width 55px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('min-width: 55px');
  });
});
