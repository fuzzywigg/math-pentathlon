/**
 * Wave 68 leftover after tip/#334 — Kings renderer K/Q glyph source exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 kings — renderer glyph K/Q source', () => {
  it('board-renderer locks king K / quad Q glyph ternary exact', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'src/games/kings-quadraphages/board-renderer.ts'),
      'utf8'
    );
    expect(src).toContain("piece.textContent = cell.type === 'king' ? 'K' : 'Q'");
  });
});
