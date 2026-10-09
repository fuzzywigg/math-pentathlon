/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in dom-security.ts.
 */
import { describe, expect, it } from 'vitest';
import {
  clearElement,
  escapeHtml,
  replaceWithSafeHtml,
  safeHtml,
  setText,
  setTrustedMarkup,
} from '../../src/core/dom-security';

describe('mutation-ui dom-security', () => {
  it('safeHtml inserts a slot for every interpolation including trailing', () => {
    // Survivors: i < values.length → <= (would overrun) / loop bounds.
    const frag = safeHtml`<span>${'a'}</span>${'b'}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.textContent).toBe('ab');
    expect(wrap.querySelectorAll('[data-mp-safe]').length).toBe(0);
  });

  it('safeHtml treats null and undefined as empty text nodes', () => {
    // Survivor: null || undefined → && would skip one branch.
    const frag = safeHtml`${null}${undefined}${'x'}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.textContent).toBe('x');
  });

  it('safeHtml adopts Node values', () => {
    const node = document.createElement('em');
    setText(node, 'hi');
    const frag = safeHtml`go ${node}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.querySelector('em')?.textContent).toBe('hi');
  });

  it('escapeHtml maps all five special characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('clearElement / replaceWithSafeHtml clear then append', () => {
    const el = document.createElement('div');
    el.textContent = 'old';
    clearElement(el);
    expect(el.childNodes.length).toBe(0);
    replaceWithSafeHtml(el, safeHtml`<b>${'n'}</b>`);
    expect(el.textContent).toBe('n');
  });

  it('setTrustedMarkup strips disallowed tags but keeps text children', () => {
    const el = document.createElement('div');
    setTrustedMarkup(el, '<script>alert(1)</script><p>ok</p>');
    expect(el.querySelector('script')).toBeNull();
    expect(el.querySelector('p')?.textContent).toBe('ok');
  });

  it('setTrustedMarkup strips attributes on allowlisted tags', () => {
    const el = document.createElement('div');
    setTrustedMarkup(el, '<p onclick="x" class="y">z</p>');
    const p = el.querySelector('p');
    expect(p?.getAttribute('onclick')).toBeNull();
    expect(p?.getAttribute('class')).toBeNull();
    expect(p?.textContent).toBe('z');
  });
});
