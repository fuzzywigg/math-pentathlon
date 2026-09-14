/**
 * Wave 49 leftover after #221/#226/#227 — Par55 injectPar55Styles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — inject styles', () => {
  beforeEach(() => document.getElementById('par55-styles')?.remove());
  it('injects once under #par55-styles', () => {
    injectPar55Styles();
    injectPar55Styles();
    expect(document.querySelectorAll('#par55-styles')).toHaveLength(1);
  });
});
