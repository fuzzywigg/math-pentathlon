/**
 * Wave 63 Contig/SD residual after tip #301 — Contig AI seat score-p2 override. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style AI score-p2 override', () => {
  it('pins #ddd6fe override for AI opponent seat leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain("[data-opponent='ai'] .contig-score-p2");
    expect(css).toContain('.game-vs-ai .contig-score-p2');
    expect(css).toMatch(
      /\[data-opponent='ai'\] \.contig-score-p2[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
