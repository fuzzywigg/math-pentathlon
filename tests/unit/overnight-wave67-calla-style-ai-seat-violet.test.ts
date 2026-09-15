/**
 * Wave 67 leftover after tip/#316 — Calla AI-seat violet chrome leftovers.
 * Human seat strokes locked; AI override stroke/gradient never hit. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style AI seat violet', () => {
  it('AI seat overrides store/arrow stroke and score gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain(
      "[data-opponent='ai'] .calla-store-p2.calla-store-active .calla-store-rect"
    );
    expect(css).toContain('drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))');
    expect(css).toContain("[data-opponent='ai'] .calla-arrow-p2");
    expect(css).toContain('linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)');
    expect(css).toContain('0 4px 12px rgba(139, 92, 246, 0.25)');
    expect(css).toContain('border-color: rgba(139, 92, 246, 0.4)');
  });
});
