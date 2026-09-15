/**
 * Wave 66 leftover after tip/#316 — Contig board-container center chrome.
 * Soft board inject flex existed; lock style.css container leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style board-container center', () => {
  it('pins contig-board-container column center gap 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-board-container\s*\{[\s\S]*?flex-direction:\s*column/
    );
    expect(css).toMatch(
      /\.contig-board-container\s*\{[\s\S]*?align-items:\s*center/
    );
    expect(css).toMatch(/\.contig-board-container\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
