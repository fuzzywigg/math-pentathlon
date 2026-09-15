/**
 * Wave 67 leftover after tip/#324 — Kwatro inject target-info pad exact.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject target-info pad exact', () => {
  it('locks scoped target-info pad exact', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[\s\S]*?padding:\s*0\.5rem 1rem/);
  });
});
