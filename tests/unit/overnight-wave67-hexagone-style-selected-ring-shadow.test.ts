/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone selected ring shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style selected ring shadow', () => {
  it('selected box-shadow ring 3px green exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 0 0 3px rgba(72, 187, 120, 0.2)');
    expect(css).toContain('.hex-a-gone-block-btn.selected');
  });
});
