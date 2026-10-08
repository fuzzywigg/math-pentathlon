/**
 * Wave 60 leftover after #290 (unit-only) — Align four idle alignments info.
 * Distinct from wave59 potential click copy leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 60 demos — align four idle alignments', () => {
  it('four-info mounts X/O has 0 alignments (2+) on empty board', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    const info = root.querySelector('#four-info')?.textContent ?? '';
    expect(info).toContain('X has 0 alignments (2+)');
    expect(info).toContain('O has 0 alignments (2+)');
  });
});
