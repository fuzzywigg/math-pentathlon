/**
 * Wave 67 leftover after tip/#316 — Contig AI score-p2 violet chrome.
 * Soft HvH #ffcdd2 existed; lock data-opponent ai #ddd6fe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style ai score violet', () => {
  it('pins [data-opponent=ai] contig-score-p2 #ddd6fe leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\[data-opponent='ai'\] \.contig-score-p2[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
