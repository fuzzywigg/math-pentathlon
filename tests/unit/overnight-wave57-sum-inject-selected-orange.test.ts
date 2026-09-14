/**
 * Wave 57 leftover after #267 — Sum selected orange inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — inject selected orange', () => {
  it('pins selected hand orange shadow token', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-hand-domino-selected');
    expect(css).toContain('#ff9800');
  });
});
