/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr createPieceGrid gap CSS source leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 56 attr — grid source gap CSS', () => {
  it('createPieceGrid source stamps gap/padding/bg leftover', () => {
    const src = readFileSync(
      resolve(__dirname, '../../src/core/attributes/attribute-ui.ts'),
      'utf8'
    );
    expect(src).toContain('gap: 12px');
    expect(src).toContain('padding: 12px');
    expect(src).toContain('background: #f5f5f5');
    expect(src).toContain('flex-wrap: wrap');
  });
});
