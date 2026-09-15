/**
 * Wave 67 leftover after tip/#324 — Kwatro target-info color #666 scoped.
 * Wave63 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject target-info color 666 scoped', () => {
  it('locks scoped .kwa-target-info color #666', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[\s\S]*?color:\s*#666/);
  });
});
