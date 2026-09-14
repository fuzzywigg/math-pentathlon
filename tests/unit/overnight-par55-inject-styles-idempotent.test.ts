/**
 * Overnight TOKENMAXX HEAVY — par-55 inject styles idempotent leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

beforeEach(() => { document.body.innerHTML = ''; document.head.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; document.head.innerHTML = ''; });

describe('Overnight par55 — inject styles idempotent', () => {
  it('second inject does not duplicate #par55-styles', () => {
    injectPar55Styles();
    injectPar55Styles();
    expect(document.querySelectorAll('#par55-styles').length).toBe(1);
  });
});
