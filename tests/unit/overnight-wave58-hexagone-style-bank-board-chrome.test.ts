/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex-a-Gone board/bank chrome CSS.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hexagone — style bank board chrome', () => {
  it('pins board min(350px) and bank gradient leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-board');
    expect(css).toContain('width: min(350px, 100%)');
    expect(css).toContain('.hex-a-gone-bank');
    expect(css).toContain('linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)');
  });
});
