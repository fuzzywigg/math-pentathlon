/**
 * Wave 67 leftover after tip/#323/#324 — AI score-p2 violet gradient.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style ai score-p2 violet', () => {
  it('AI opponent remaps score-p2 to violet gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)');
    expect(css).toContain('0 4px 12px rgba(139, 92, 246, 0.25)');
    expect(css).toContain('border-color: rgba(139, 92, 246, 0.4)');
  });
});
