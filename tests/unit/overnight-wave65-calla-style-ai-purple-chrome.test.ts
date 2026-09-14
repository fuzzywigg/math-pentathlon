/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla AI opponent purple chrome.
 * Soft AI seat class elsewhere; lock #ede9fe / purple rgba leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style AI purple chrome', () => {
  it('pins AI calla-score-p2.active purple gradient leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25)');
    expect(css).toContain('border-color: rgba(139, 92, 246, 0.4)');
    expect(css).toContain(
      "drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))"
    );
  });
});
