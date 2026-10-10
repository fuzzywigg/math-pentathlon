/**
 * q-mp-621 — Close `dom-security` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ cut HEAD):
 *   `src/core/dom-security.ts` **144** LOC (matches backlog)
 *   Dedicated + mutation `*dom-security*` suites before this file:
 *     **97.91%** lines (47/48) / **86.36%** branches (19/22)
 *   Uncovered under that glob: L58 `!slot` continue; L19 `HTML_ESCAPE[ch] ?? ch`;
 *     L119 `node.textContent ?? ''`
 *   Engine r21 (`#1034`) already pins L58 outside the `*dom-security*` glob —
 *     leave that draft open (**contained**); this suite owns the glob residual.
 *   Mutation w15 (`#933` / `457`) owns mutation scores — leave **contained**.
 *
 * Constraints (binding screen): tests only; NO `src/core/dom-security.ts`
 * edits; never weaken or loosen any sanitizer expectation — characterize
 * existing behavior only. No AI / rules / scoring / copy / aria pins; no
 * ratchet JSON; Hex Hard 450ms untouched; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  escapeHtml,
  safeHtml,
  setText,
  setTrustedMarkup,
} from '../../src/core/dom-security';

const DOM_SECURITY_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/dom-security.ts'
  ),
  'utf8'
);

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('q-mp-621 — dom-security residual branch keep-sites', () => {
  it('source keeps escapeHtml HTML_ESCAPE miss fallback (L19 ?? ch)', () => {
    expect(DOM_SECURITY_SRC).toMatch(/HTML_ESCAPE\[ch\]\s*\?\?\s*ch/);
  });

  it('source keeps safeHtml missing-slot continue (L57–58)', () => {
    expect(DOM_SECURITY_SRC).toMatch(
      /if\s*\(\s*!slot\s*\)\s*\{\s*continue\s*;/
    );
  });

  it('source keeps TEXT_NODE textContent nullish fallback (L119)', () => {
    expect(DOM_SECURITY_SRC).toMatch(
      /createTextNode\(\s*node\.textContent\s*\?\?\s*''\s*\)/
    );
  });
});

describe('q-mp-621 — dom-security residual branch arms', () => {
  it('safeHtml skips a value when querySelector misses its data-mp-safe slot', () => {
    // L57–58: if (!slot) continue. Well-formed templates always find slots;
    // force one miss so the first interpolation is skipped and later values
    // still adopt. Does not loosen sanitizer policy — leftover markers stay
    // inert data attributes, not executable markup.
    const realQS = DocumentFragment.prototype.querySelector;
    let calls = 0;
    const spy = vi
      .spyOn(DocumentFragment.prototype, 'querySelector')
      .mockImplementation(function (this: DocumentFragment, selectors: string) {
        calls += 1;
        if (calls === 1) {
          return null;
        }
        return realQS.call(this, selectors);
      });

    const node = document.createElement('em');
    setText(node, 'kept');
    const frag = safeHtml`${'dropped'}${node}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);

    expect(spy).toHaveBeenCalled();
    expect(wrap.querySelector('em')?.textContent).toBe('kept');
    expect(wrap.textContent).toBe('kept');
    expect(wrap.querySelectorAll('[data-mp-safe="0"]').length).toBe(1);
    expect(wrap.querySelectorAll('[data-mp-safe="1"]').length).toBe(0);
    expect(wrap.querySelector('script')).toBeNull();
  });

  it('escapeHtml HTML_ESCAPE miss falls through to raw ch (defensive ??)', () => {
    // L19: `(ch) => HTML_ESCAPE[ch] ?? ch`. Public regex only matches keys
    // present in the map, so the right arm is unreachable without driving the
    // replacer. Force one miss — expect identity passthrough, not a loosened
    // public escape contract (normal specials still encode in sibling assert).
    const realReplace = String.prototype.replace;
    let missOut: string | undefined;
    vi.spyOn(String.prototype, 'replace').mockImplementation(function (
      this: string,
      search: unknown,
      replacer: unknown
    ) {
      if (
        search instanceof RegExp &&
        String(search).includes('&') &&
        typeof replacer === 'function'
      ) {
        missOut = (replacer as (ch: string) => string)('\u0000');
        return missOut;
      }
      return (realReplace as (this: string, ...args: unknown[]) => string).call(
        this,
        search,
        replacer
      );
    });

    escapeHtml('ignored-by-spy');
    expect(missOut).toBe('\u0000');

    vi.restoreAllMocks();
    // Sanitizer expectation held: public specials still encode.
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('sanitizeTrustedNode TEXT_NODE with null textContent yields empty text', () => {
    // L119: `document.createTextNode(node.textContent ?? '')`. Real jsdom
    // TEXT_NODE.textContent is never null; force one null get during
    // setTrustedMarkup so the ?? '' arm runs. Policy unchanged: scripts /
    // attrs still stripped on a follow-up call.
    const orig = Object.getOwnPropertyDescriptor(
      Node.prototype,
      'textContent'
    )!;
    let textGets = 0;
    vi.spyOn(Node.prototype, 'textContent', 'get').mockImplementation(function (
      this: Node
    ) {
      if (this.nodeType === Node.TEXT_NODE) {
        textGets += 1;
        if (textGets === 1) {
          return null as unknown as string;
        }
      }
      return orig.get!.call(this);
    });

    const el = document.createElement('div');
    setTrustedMarkup(el, 'hello');
    expect(textGets).toBeGreaterThanOrEqual(1);
    expect(el.childNodes.length).toBe(1);
    expect(el.childNodes[0]?.nodeType).toBe(Node.TEXT_NODE);
    expect(el.textContent).toBe('');

    vi.restoreAllMocks();
    // Sanitizer expectation held: disallowed tags / attrs still stripped.
    setTrustedMarkup(
      el,
      `<p onclick="alert(1)">Hi <strong>ok</strong></p><script>x</script>`
    );
    expect(el.querySelector('script')).toBeNull();
    expect(el.querySelector('p')?.getAttribute('onclick')).toBeNull();
    expect(el.querySelector('strong')?.textContent).toBe('ok');
  });
});
