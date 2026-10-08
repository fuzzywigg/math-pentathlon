/**
 * Wave 60 leftover after #290 (unit-only) — Align hex idle Current player Blue.
 * Distinct from wave58 Winner: Blue! leftover. Tests-only.
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

describe('Wave 60 demos — align hex idle Blue', () => {
  it('hex status mounts Current player Blue with .player-b span', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    const status = root.querySelector('#hex-status');
    expect(status?.textContent).toBe('Current player: Blue');
    expect(status?.querySelector('.player-b')?.textContent).toBe('Blue');
  });
});
