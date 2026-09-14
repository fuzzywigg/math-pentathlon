/**
 * Wave 42 — inspectDropSpeech / resolveInspectTarget leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  resolveInspectTarget,
  stubNarrationFor,
  inspectDropSpeech,
} from '../../src/core/owl/ollie-inspect-map';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 42 owl-inspect — drop speech', () => {
  it('null element → unknown narration', () => {
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
    expect(inspectDropSpeech(null)).toMatch(/don't recognize|STUB inspect/i);
  });

  it('howto chrome resolves via #help-btn', () => {
    document.body.innerHTML = '<button id="help-btn">Help</button>';
    const el = document.getElementById('help-btn')!;
    expect(resolveInspectTarget(el)).toEqual({
      kind: 'chrome',
      chrome: 'howto',
    });
    expect(inspectDropSpeech(el)).toMatch(/How to Play/i);
  });

  it('kings cell attrs resolve to kings-cell', () => {
    document.body.innerHTML =
      '<div class="cell" data-row="2" data-col="3"></div>';
    const el = document.querySelector('.cell')!;
    expect(resolveInspectTarget(el)).toEqual({
      kind: 'kings-cell',
      row: 2,
      col: 3,
    });
    expect(stubNarrationFor(resolveInspectTarget(el))).toMatch(/row 2/);
  });

  it('hex-a-gone bank shape takes precedence', () => {
    document.body.innerHTML = '<button data-shape="V">V</button>';
    const el = document.querySelector('[data-shape]')!;
    expect(resolveInspectTarget(el)).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'V',
    });
  });

  it('unknown DOM node falls back to unknown', () => {
    document.body.innerHTML = '<div class="random-widget"></div>';
    expect(resolveInspectTarget(document.querySelector('.random-widget'))).toEqual({
      kind: 'unknown',
    });
  });
});
