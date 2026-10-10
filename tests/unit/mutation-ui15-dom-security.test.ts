/**
 * q-mp-457 mutation audit UI wave 15 — kill / re-pin survivors in
 * dom-security. Structural / DOM-shape asserts only (no copy-body pins).
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

describe('mutation-ui15 dom-security', () => {
  it('safeHtml build loop stays i < strings.length (kills L45 <→<= / 0→1)', () => {
    const frag = safeHtml`<b>${'x'}</b><i>${'y'}</i>`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.querySelectorAll('b').length).toBe(1);
    expect(wrap.querySelectorAll('i').length).toBe(1);
    expect(wrap.textContent).toBe('xy');
    expect(wrap.querySelectorAll('[data-mp-safe]').length).toBe(0);
  });

  it('safeHtml value-slot guard i < values.length is exclusive', () => {
    // Baseline survivor L55: flip < → <= is observationally equivalent
    // (extra index has no slot). Re-pin the productive arm: every real
    // interpolation is consumed and leaves no leftover markers.
    const frag = safeHtml`A${1}B${2}C${3}D`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.textContent).toBe('A1B2C3D');
    expect(wrap.querySelectorAll('[data-mp-safe]').length).toBe(0);
  });

  it('missing slot is skipped via !slot continue (kills L57 remove !)', () => {
    // With a normal template every slot exists; pin that filled values
    // never leave markers, and Node adoption still works.
    const node = document.createElement('span');
    setText(node, 'n');
    const frag = safeHtml`${node}${false}${0}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.querySelector('span')?.textContent).toBe('n');
    expect(wrap.textContent).toBe('nfalse0');
  });

  it('null || undefined empty-text arm (kills L63 ||→&& / === flips)', () => {
    const frag = safeHtml`${null}${undefined}${'ok'}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.textContent).toBe('ok');
    expect(wrap.childNodes.length).toBeGreaterThanOrEqual(1);
  });

  it('setTrustedMarkup keeps TEXT_NODE / drops non-element non-text', () => {
    const el = document.createElement('div');
    setTrustedMarkup(el, 'plain<p>ok</p><!--gone-->');
    expect(el.textContent).toContain('plain');
    expect(el.querySelector('p')?.textContent).toBe('ok');
    // Comment nodes are dropped (nodeType !== ELEMENT and !== TEXT).
    expect(
      [...el.childNodes].every(
        (n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE
      )
    ).toBe(true);
  });

  it('disallowed tags unwrap children; allowlist strips attrs', () => {
    const el = document.createElement('div');
    setTrustedMarkup(
      el,
      '<section data-x="1"><strong class="c">t</strong></section>'
    );
    expect(el.querySelector('section')).toBeNull();
    const strong = el.querySelector('strong');
    expect(strong?.textContent).toBe('t');
    expect(strong?.getAttribute('class')).toBeNull();
  });

  it('escapeHtml / clear / replaceWithSafeHtml stay markup-safe', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
    const el = document.createElement('div');
    el.appendChild(document.createElement('span'));
    clearElement(el);
    expect(el.childNodes.length).toBe(0);
    replaceWithSafeHtml(el, safeHtml`<em>${'z'}</em>`);
    expect(el.querySelector('em')?.textContent).toBe('z');
  });

  // Equivalent under public API: when i === values.length the querySelector
  // for data-mp-safe="${i}" finds nothing and continues — same DOM as `<`.
  it.skip('pinned equivalent: safeHtml L55 i < values.length → <=', () => {
    expect(true).toBe(true);
  });
});
