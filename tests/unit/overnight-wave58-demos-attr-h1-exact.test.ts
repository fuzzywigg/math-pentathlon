/**
 * Wave 58 leftover after #267 — Attribute demo exact h1.
 * Distinct from set-btn labels leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — attr h1 exact', () => {
  it('mounts Attribute Sets Demo h1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'Attribute Logic Demo'
    );
  });
});
