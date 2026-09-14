/**
 * Wave 49 — Par55 injectPar55Styles idempotent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — inject styles', () => {
  beforeEach(() => {
    document.getElementById('par55-styles')?.remove();
  });
  it('injects once', () => {
    injectPar55Styles();
    injectPar55Styles();
    expect(document.querySelectorAll('#par55-styles').length).toBe(1);
  });
});
