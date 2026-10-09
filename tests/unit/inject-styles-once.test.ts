/**
 * q-mp-106 — characterization for src/ui/inject-styles.ts.
 * Covers id-collision no-op + style text insertion. Tests-only.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { injectStylesOnce } from '../../src/ui/inject-styles';

const STYLE_IDS = ['q-mp-106-a', 'q-mp-106-b', 'q-mp-106-pre'] as const;

afterEach(() => {
  for (const id of STYLE_IDS) {
    document.getElementById(id)?.remove();
  }
});

describe('injectStylesOnce', () => {
  it('appends a style element with the given id and css text to document.head', () => {
    const css = '.q-mp-106-probe { color: rgb(1, 2, 3); }';
    injectStylesOnce('q-mp-106-a', css);

    const el = document.getElementById('q-mp-106-a');
    expect(el).toBeInstanceOf(HTMLStyleElement);
    expect(el?.tagName).toBe('STYLE');
    expect(el?.textContent).toBe(css);
    expect(el?.parentNode).toBe(document.head);
    expect(document.querySelectorAll('#q-mp-106-a')).toHaveLength(1);
  });

  it('no-ops on id collision (second inject keeps original text and one node)', () => {
    injectStylesOnce('q-mp-106-a', '.first { opacity: 1; }');
    injectStylesOnce('q-mp-106-a', '.second { opacity: 0; }');

    const nodes = document.querySelectorAll('#q-mp-106-a');
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.textContent).toBe('.first { opacity: 1; }');
  });

  it('no-ops when any element with the same id already exists', () => {
    const pre = document.createElement('div');
    pre.id = 'q-mp-106-pre';
    pre.textContent = 'pre-existing';
    document.body.appendChild(pre);

    injectStylesOnce('q-mp-106-pre', '.should-not-inject { display: none; }');

    expect(document.getElementById('q-mp-106-pre')).toBe(pre);
    expect(pre.tagName).toBe('DIV');
    expect(document.querySelectorAll('style#q-mp-106-pre')).toHaveLength(0);
  });

  it('allows distinct ids to coexist with their own css text', () => {
    injectStylesOnce('q-mp-106-a', '.a { margin: 0; }');
    injectStylesOnce('q-mp-106-b', '.b { padding: 0; }');

    expect(document.getElementById('q-mp-106-a')?.textContent).toBe('.a { margin: 0; }');
    expect(document.getElementById('q-mp-106-b')?.textContent).toBe('.b { padding: 0; }');
    expect(document.querySelectorAll('style#q-mp-106-a, style#q-mp-106-b')).toHaveLength(2);
  });
});
